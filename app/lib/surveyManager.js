/**
 * lib.survey
 */
var log = require('utils/log');
var events = require('event');
var notifications = require('notifications');
var dispatcher = require('dispatcher');

// Internals
var timing = false,
    serviceTrack = { service: null, notification: null },
    onServiceTrackEnd;  // Only for Android

var surveyTimer = module.exports = {
    /**
     * @method startSurvey
     * @return {Object} Survey object
     */
    startSurvey: function (userId) {
        // Get settings
        var settings = Ti.App.Properties.getObject('app-survey-settings');
        var totalTime = settings ? settings.surveyDuration : Alloy.CFG.surveyDuration;
        var startTime = new Date().getTime();
        var endTime = startTime + ( totalTime * 60000 );
        // Create uuid
        var uuid = require('uuid').create();
        // Create survey object
        var surveyObject = { surveyId: uuid.toString(), startTime: startTime, endTime: endTime };
        // Save active survey both persistent as in local memory
        saveSurveyData(surveyObject, userId);
        // Start trackingService on the background if we quit the app
        surveyTimer.startTrackingService();
        // Set a local notification
        setLocalNotification(endTime);
        log.info('[lib/survey] StartSurvey - ', surveyObject);
        // Return  data
        return surveyObject;
    },
    /**
     * @method activeSurvey
     * Return app-survey object from app properties
     * @return {Object} Active survey data object
     */
    activeSurvey: function () {
        log.info('[lib/survey] Return activeSurvey', Ti.App.Properties.getObject('app-survey'));
        return Ti.App.Properties.getObject('app-survey');
    },
    /**
     * @method stopSurvey
     * Stop survey by removing property
     */
    stopSurvey: function () {
        log.info('[lib/survey] Stop current survey');

        // Remove the background service
        if (OS_IOS && Ti.App.iOS.BackgroundService) {
            Ti.App.iOS.BackgroundService.unregister();
        } else if (OS_ANDROID && serviceTrack.service) {
            serviceTrack.service.removeEventListener('taskremoved', onServiceTrackEnd);
            serviceTrack.service.removeEventListener('stop', onServiceTrackEnd);
            onServiceTrackEnd = null;

            if (!serviceTrack.service.selfStopped) {
                serviceTrack.service.stop();
            }

            serviceTrack.service = null;
        }

        // Stop polling
        surveyTimer.stopTrackLocation();
    },

    /**
     * [destroySurvey description]
     * @return {[type]} [description]
     */
    destroySurvey: function () {
        surveyTimer.stopSurvey();
        var surveyData = Ti.App.Properties.getObject('app-survey');
        // Remove all data reference to the survey
        Ti.App.Properties.removeProperty('app-survey');
        Ti.App.Properties.removeProperty('app-survey-user');
        // Remove any left over events
        require('event').destroySurveyEvent();
        // Remove notification
        cancelLocalNotification();
        // Remove any data releated to the survey
        return surveyData;
    },

    /**
     * cancelSurvey description]
     * @return {[type]} [description]
     */
    cancelSurvey: function () {
        var surveyData = surveyTimer.destroySurvey();
        if (surveyData) {
            deleteSurveyData(surveyData);
        }
    },

    /**
     * @method startBackgroundService
     * Start running an interval gps tracker to add the gps coordinates to the survey
     */
    startTrackingService: function () {
        log.info('[lib/survey] Start running the background service');
        if (OS_IOS) {
            serviceTrack.service = Ti.App.iOS.registerBackgroundService({url: 'serviceTrack.js'});
        } else if (OS_ANDROID) {
            var serviceTrackIntent = Ti.Android.createServiceIntent({url: 'serviceTrack.js'});
            serviceTrackIntent.putExtra('interval', 600); // !TODO: Remove hardcoded interval value
            serviceTrack.service = Ti.Android.createService(serviceTrackIntent);
            serviceTrack.service.start();
        }
        timing = true;
    },

    /**
     * @metho trackLocation
     * @return {[type]} [description]
     */
    trackLocation: function () {
        // Kill function if needed (if clearTimout failed for some reason)
        if (!timing) {
            return;
        }
        // Store current GPS coordinates
        var location = require('utils/location').getCurrentLatLng(function (err, locationData) {
            events.saveSurveyTrackEvent({location: locationData});
            // Let the survey view know there is an update
            require('dispatcher').trigger('surveyUpdate');
        });
    },

    stopTrackLocation: function () {
        timing = false;
    },

    setUser: function (userData) {
        log.info('[lib/survey] Save survey user', userData);
        Ti.App.Properties.setObject('app-survey-user', userData);
    },

    getUser: function () {
        log.info('[lib/survey] Return survey user', Ti.App.Properties.getObject('app-survey-user'));
        return Ti.App.Properties.getObject('app-survey-user');
    }
};

/**
 * [saveSurveyData description]
 * @param  {[type]} surveyObject [description]
 * @return {[type]}              [description]
 */
function saveSurveyData (surveyObject) {
    Ti.App.Properties.setObject('app-survey', surveyObject);

    var userData = surveyTimer.getUser();

    if (!userData) {
        return log.error('[lib/survey] No user data found, cannot save survey');
    }

    // Save survey model
    var surveyModel = Alloy.createModel('Survey', {
        "survey_id": surveyObject.surveyId,
        "observer_id": userData.id,
        "created": new Date().getTime(),
        "startTime": surveyObject.startTime,
        "endTime": surveyObject.endTime,
        "uploaded": 0
    });

    surveyModel.save();
}

/**
 * [deleteSurveyData description]
 * @param  {[type]} surveyObject [description]
 * @return {[type]}              [description]
 * @todo: This must be easier than this...
 */
function deleteSurveyData (surveyObject) {
    var surveys = Alloy.createCollection('Survey');
    //Remove a survey model if it exists
    surveys.fetch({
        silent: false,
        success: function(collection, response, options) {
            log.info('[lib/surveys] Retreived surveys', collection);
            surveys.get(surveyObject.surveyId).destroy();
        },
        error: function(collection, response, options) {
            log.info('[lib/surveys] Unable to retreive the survey', response);
        }
    });

    // Remove any event models if they exist
    var events = Alloy.createCollection('Event');

    events.fetch({
        query: 'SELECT * from events where survey_id = "' + surveyObject.surveyId + '"',
        success: function(collection, response, options) {
            events.each(function (model) {
                model.destroy();
            });
        },
        error: function(collection, response, options) {
            log.info('[surveys/survey] collection, response', response);
        }
    });
}


/**
 * @method setLocalNotification
 * Set a local notification on iOS
 * @param {Int} notificationTime Timestamp of the finish time of the survey
 * @todo: Android
 */
function setLocalNotification (notificationTime) {
    // Update the nr of notifications, but silent (notification will update badge)
    notifications.increase(1, true);

    var notificationCount = notifications.get() ? notifications.get() : 1;
    if (OS_IOS) {
        // Get the new badge count to display on notification
        // Schedule notification
        serviceTrack.notification = Ti.App.iOS.scheduleLocalNotification({
            alertAction: "continue",
            alertBody: L('survey.notification.body'),
            badge: notificationCount,
            date: new Date(notificationTime),
            sound: "/alert.wav",
        });
    } else if (OS_ANDROID) {
        /* Create the notification to send */
        var className = Ti.App.id + "." + Ti.App.name.substring(0,1).toUpperCase() +
                Ti.App.name.substring(1).toLowerCase() + "Activity";

        var intent = Ti.Android.createIntent({
            packageName: Ti.App.id,
            className: className,
            action: Ti.Android.ACTION_MAIN
        });
        intent.addCategory(Ti.Android.CATEGORY_LAUNCHER);
        intent.flags = Ti.Android.FLAG_ACTIVITY_REORDER_TO_FRONT;//Ti.Android.FLAG_ACTIVITY_CLEAR_TOP | Ti.Android.FLAG_ACTIVITY_NEW_TASK;

        serviceTrack.notification = Titanium.Android.createNotification({
            //icon: Ti.App.Android.R.drawable.notification_icon,
            contentTitle: String.format(L('survey.notification.title'), notificationCount),
            contentText: L('survey.notification.body'),
            contentIntent: Ti.Android.createPendingIntent({
                intent: intent,
                flags: Titanium.Android.FLAG_UPDATE_CURRENT
            })
        });

        /* No scheduler for Android, let's launch the event once the service is over */
        onServiceTrackEnd = (function (_serviceTrack) {
            return _.once(function () {
                Ti.Android.NotificationManager.notify(14, _serviceTrack.notification);
                _serviceTrack.service.selfStopped = true;
            });
        })(serviceTrack);

       serviceTrack.service.addEventListener('stop', onServiceTrackEnd);
       serviceTrack.service.addEventListener('taskremoved', onServiceTrackEnd);
    }
}

/**
 * @method cancelLocalNotification
 * Remove the timed local notification if set
 */
function cancelLocalNotification () {
    if (OS_IOS && serviceTrack.notification) {
        serviceTrack.notification.cancel();
    } else if (OS_ANDROID && serviceTrack.notification) {
       Ti.Android.NotificationManager.cancel(14);
    }

    serviceTrack.notification = null;
}
