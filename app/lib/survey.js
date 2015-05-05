/**
 * lib.survey
 */
var log = require('utils/log');
var events = require('event');

// Internals
var timer;
var timing = false;

var surveyTimer = module.exports = {
    startSurvey: function () {
        var startTime = new Date().getTime();
        var endTime = startTime + ( 2 * 60000 );
        var uuid = require('uuid').create();
        var surveyObject = { surveyId: uuid.toString(), startTime: startTime, endTime: endTime };
        // Save object
        Ti.App.Properties.setObject('app-survey', surveyObject);
        log.info('[lib/survey] StartSurvey at time', surveyObject);
        surveyTimer.startTrackingService();
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
        if (Ti.App.iOS.BackgroundService) {
            Ti.App.iOS.BackgroundService.unregister();
        }
        // Stop polling
        surveyTimer.stopTrackLocation();

    },

    destroySurvey: function () {
        surveyTimer.stopSurvey();
        // Remove reference to the survey
        Ti.App.Properties.removeProperty('app-survey');
    },

    /**
     * @method startBackgroundService
     * Start running an interval gps tracker to add the gps coordinates to the survey
     */
    startTrackingService: function () {
        Ti.App.addEventListener('resumed', surveyTimer.onResumed);
        Ti.App.addEventListener('paused', surveyTimer.onPaused);
        log.info('[lib/survey] Start running the background service');
        if (OS_IOS) {
            Ti.App.iOS.registerBackgroundService({url: 'iosTrack.js'});
        }
        timing = true;
        surveyTimer.trackLocation();
    },

    trackLocation: function () {
        timer = setTimeout(function () {
            // Kill function if needed (if clearTimout failed for some reason)
            if (!timing) {
                return;
            }
            // Store current GPS coordinates
            var location = require('utils/location').getCurrentLatLng(function (err, locationData) {
                events.saveSurveyEvent('track', locationData);
                // Call function again
                surveyTimer.trackLocation();
                // Let the survey view know there is an update
                Ti.App.fireEvent('survey:updated');
            });
        }, 30000);
    },

    stopTrackLocation: function () {
        timing = false;
        clearTimeout(timer);
    },

    onPaused: function () {
        surveyTimer.stopTrackLocation();
    },
    /**
     * @method onResumed
     * Start tracking again once we are back
     * @return {[type]} [description]
     */
    onResumed: function () {
        timing = true;
        surveyTimer.trackLocation();
    }
};
