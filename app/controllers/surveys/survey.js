/**
 * Controller for surveys survey
 *
 * @class Controllers.surveys.survey
 * @uses utils.log
 * @uses survey
 * @uses alloy.moment
 * @uses dispatcher
 */
var log = require('utils/log');
var libSurvey = require('surveyManager');
var events = require('event');
var moment = require('alloy/moment');
var dispatcher = require('dispatcher');
var WM = require('windowManager');

// Settings
var settings = Ti.App.Properties.getObject('app-survey-settings') || {
    trackingInterval: Alloy.CFG.intervalDuration,
    surveyDuration: Alloy.CFG.surveyDuration,
    unit: 'METRIC'
};

// Internals
var startTime;
var endTime;
var timer;
var active = false;
var state = 'PREACTIVE';
var vibrations = 20;
var startedSurvey = false;

// constants
var TRACKTIMEINTERVAL = settings.trackingInterval * 60;

// Collections
var eventCollection = Alloy.createCollection('Event');

_.extend($, {
    /**
     * @constructor
     * @method construct
     * @param {Object} config Controller configuration
     */
    construct: function(config) {
        // Set state (e.g. started from active or inactive)
        if (config.startedFromRoot) {
            activateSurvey(libSurvey.activeSurvey());
            state = 'ACTIVE';
            $.preSurvey.hide();
        } else {
            $.surveyTimer.text = settings.surveyDuration + ':00';
            WM.closeNav({animated: false});
        }

        // open window
        if(OS_ANDROID) $.getView().addEventListener('android:back', onClickCloseButton);
        WM.openWinInNewWindow($.getView(), {title: L('surveys.survey.title')});

        //Listners
        dispatcher.on('surveyUpdate', renderSurveyTimeline);

        var TRACKLOCATIONTIME = settings.surveyDuration * 60 - settings.trackingInterval * 60;
        setTrackLocationTimeForBackground(TRACKLOCATIONTIME);

        dispatcher.on('vibrate', vibratePhone);
        dispatcher.on('survey:delete', renderSurveyTimeline);
    },

    /**
     * @method destruct
     * function executed when closing window
     */
    destruct: function() {
        dispatcher.off('surveyUpdate', renderSurveyTimeline);
        dispatcher.off('survey:delete', renderSurveyTimeline);
        dispatcher.off('vibrate', vibratePhone);

        if (OS_IOS) {
            Ti.App.removeEventListener('pause', pauseSurvey);
            Ti.App.removeEventListener('resume', continueSurvey);
        }
    }
});

/**
 * @method onClickCloseButton
 * Handle `click` on close button
 * @param  {Object} evt
 *
 * Show dialog to confirm stopping survey
 */
function onClickCloseButton (evt) {
    var dialog = Ti.UI.createAlertDialog({
        cancel: 1,
        buttonNames: [L('surveys.survey.deleteSurveyDelete'), L('surveys.survey.deleteSurveyCancel')],
        message: L('surveys.survey.deleteSurveyMessage'),
        title:  L('surveys.survey.deleteSurveyTitle')
    });

    dialog.addEventListener('click', function(evt) {
        if (evt.index === evt.source.cancel){
            return;
        }

        // Stop survey, stop time, start index again, close this window.
        stopTime();
        libSurvey.cancelSurvey();
        vibrations = 0;

        dispatcher.trigger('survey:closed');

        // Stop listening for events
        if (OS_IOS) {
            Ti.App.removeEventListener('pause', pauseSurvey);
            Ti.App.removeEventListener('resume', continueSurvey);
        }
        WM.closeNav({animated: true});
    });

    dialog.show();
}

/**
 * @method doClickStartSurvey
 * Handle `click` on startSurvey, call startSurvey function
 * @param  {Object} evt
 */
function doClickStartSurvey (evt) {
    log.info('[surveys/survey] Clicked start survey');

    // Check if we have any coordinates
    if (!require('utils/location').getLocationsCoordinates()) {
        Alloy.createController('surveys/coordinates');
        dispatcher.on('survey:coordinates', startSurvey);
        dispatcher.on('survey:gps', doClickStartSurvey);
        return;
    }

    // Get current latitude and longitude from the system
    require('utils/location').getCurrentLatLng(function (err, currentLocation) {
        if (err) {
            log.error('[surveys/survey] Unable to determine location, without location the survey is unable to continue');
            Alloy.createController('surveys/coordinates');
            dispatcher.on('survey:coordinates', startSurvey);
            dispatcher.on('survey:gps', doClickStartSurvey);
            return;
        }
        // Start survey
        startSurvey(currentLocation);
    });
}
/**
 * [startSurvey description]
 * @param  {[type]} currentLocation [description]
 * @return {[type]}                 [description]
 */
function startSurvey (currentLocation) {
    // Already started ignore new events (@todo use active variable?)
    if (startedSurvey) {
        return;
    }
    startedSurvey = true;
    _.delay(function () {
        startedSurvey = false;
    }, 100);
    // Remove any listeners if we have any
    dispatcher.off('survey:coordinates', startSurvey);
    dispatcher.off('survey:gps', doClickStartSurvey);
    var surveyObject = libSurvey.startSurvey();
    var currentTime = new Date().getTime();
    // Move location error to the library
    events.saveSurveyEvent('startSurvey', {startingTime: currentTime, startLocation: currentLocation});
    activateSurvey(surveyObject);

    // Listen to event
    if (OS_IOS) {
        Ti.App.addEventListener('pause', pauseSurvey);
        Ti.App.addEventListener('resume', continueSurvey);
    } else {
        var activity = $.getView().getActivity();
        activity.onResume = continueSurvey;
        activity.onPause = pauseSurvey;
    }
}

/**
 * @method doClickAddSighting
 * Handle `click` on addSighting, create sighting/material controller
 * @param  {Object} evt
 */
function doClickAddSighting (evt) {
    log.info('[surveys/survey] Started new sighting');
        // Get current time
    var sightingStartTime = new Date().getTime();
    var callback = false;
    // Request location from system
    require('utils/location').getCurrentLatLng(function (error, locationObject) {
        if (callback) {
            return;
        }

        callback = true;
        var dataObject = {};
        // Add time to object
        dataObject.startTime = sightingStartTime;
        dataObject.startLocation = locationObject;
        // Track event
        events.initSurveyEvent('sighting', dataObject);
        require('flow').sighting();
    });

    _.delay(function () {
        if (!callback) {
            callback = true;
            var dataObject = {};
            // Add time to object
            dataObject.startTime = sightingStartTime;
            dataObject.startLocation = {};
            // Track event
            events.initSurveyEvent('sighting', dataObject);
            require('flow').sighting();
        }
    }, 500);
}

/**
 * @method doClickFinishSurvey
 * Handle `click`on doClickFinishSurvey, create sighting/material controller
 * @param  {Object} evt
 */
function doClickFinishSurvey (evt) {
    vibrations = 0;
    events.initSurveyEvent('finishSurvey');
    log.info('[surveys/survey] Finished survey');
    require('flow').postSurvey();
}

/**
 * @method onAddEvent
 * Add event model to survyeTableView
 * @param  {Object} model
 */
function onAddEvent (model) {
    log.info('[surveys/survey] Tracking onAddedEvent', model.attributes);
    var eventDataView = Alloy.createController('surveys/surveyRow', {model: model}).getView();
    $.surveyTableView.appendRow(eventDataView);
    $.surveyTableView.height = Ti.UI.FILL;
}

/**
 * @method startSurvey
 */
function activateSurvey(surveyTimeObject) {
    log.info('[surveys/survey] Activated survey', surveyTimeObject);

    startTime = surveyTimeObject.startTime;
    endTime = surveyTimeObject.endTime;

    var currentTime = new Date().getTime();

    renderSurveyTimeline();

    if (currentTime < surveyTimeObject.endTime) {
        startClock(surveyTimeObject);
        updateViewState('ACTIVE');
        return;
    }

    state = 'POSTACTIVE';
    updateViewState('POSTACTIVE');
    libSurvey.stopSurvey();
}



/**
 * [startClock description]
 * @param  {[type]} surveyTimeObject [description]
 * @return {[type]}                  [description]
 */
function startClock (surveyTimeObject) {
    active = true;
    updateTime();
}

/**
 * [updateTime description]
 * @return {[type]} [description]
 */
function updateTime () {
    if (!active) {
        return;
    }

    //log.info('[surveys/survey] Retreiving remainder');
    var remainder = endTime - new Date().getTime();

    // Stop the clock once its done
    if (remainder <= 0) {
        // Final tracking
        libSurvey.trackLocation();
        state = 'POSTACTIVE';
        updateViewState('POSTACTIVE');
        $.surveyTimer.text = '00:00';
        libSurvey.stopSurvey();
        vibrations = 20;
        vibratePhone();
        return;
    }

    var remainingSeconds = remainder / 1000;
    // Retreive the Tracklocation time from memory as it might have been changed by the background service
    var TRACKLOCATIONTIME = Ti.App.Properties.getString('app-survey-trackLocationTime');

    // Track location
    if (remainingSeconds < TRACKLOCATIONTIME && TRACKLOCATIONTIME > 0) {
        libSurvey.trackLocation();
        TRACKLOCATIONTIME = TRACKLOCATIONTIME - TRACKTIMEINTERVAL;
        // Update value for background Service.
        setTrackLocationTimeForBackground(TRACKLOCATIONTIME);
    }

    var remainingMinutes = remainingSeconds / 60;
    var minutes = Math.floor(remainingMinutes);
    var seconds = Math.floor(remainingSeconds - minutes * 60);
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    $.surveyTimer.text = minutes + ':' + seconds;
    timer = setTimeout(function () { updateTime(); }, 50);
}

function vibratePhone () {
    if (vibrations > 0) {
        Ti.Media.vibrate();
        vibrations = vibrations - 1;
        _.delay(function () {
            vibratePhone();
        }, 2000);
    }
}

/**
 * @method stopSurvey
 * Stop time and remove all reference to the survey
 */
function stopSurvey () {
    stopTime();
    Ti.App.removeEventListener('survey:updated', renderSurveyTimeline);
    libSurvey.stopSurvey();
}

/**
 * @method stopTime
 * Set active to false, and clear survey clock
 */
function stopTime () {
    active = false;
    clearTimeout(timer);
}

/**
 * @method updateViewState
 * Update the view based on pre, post and active survey
 */
function updateViewState (state) {
    var stateChange = {
        'ACTIVE' : function changeStateToActive () {
            $.preSurvey.hide();
            // Add the text to indicate start
            $.surveyStartTime.text = L('surveys.survey.started') + ' ' + moment(new Date(startTime)).format('MMMM Do [at] HH:mm');
            $.surveyStartTime.opacity = 1; //@todo animate
            // @todo: Show some kind of animator to show we have started
            // Update button
            $.startSurveyContainer.height = 0;
            $.startSurveyContainer.visibile = false;
            $.sightingContainer.visible = true;
            $.sightingContainer.height = Ti.UI.SIZE;
            // Show events
            $.surveyTableView.visible = true;
        },
        'POSTACTIVE' : function changeStateToPostActive () {
            $.preSurvey.hide();
            // Remove sighting container
            $.startSurveyContainer.height = 0;
            $.startSurveyContainer.visibile = false;
            $.sightingContainer.height = 0;
            $.sightingContainer.visibile = false;
            $.finishSurveyContainer.visible = true;
            $.finishSurveyContainer.height = Ti.UI.SIZE;
            // Correct time
            $.surveyTimer.text = '00:00';
            $.surveyStartTime.text = L('surveys.survey.started') + ' ' + moment(new Date(startTime)).format('MMMM Do [at] HH:mm');
            $.surveyStartTime.opacity = 1;
            // Show the events
            $.surveyTableView.visible = true;
        }
    };


    if (_.contains(['PREACTIVE', 'ACTIVE', 'POSTACTIVE'], state)) {
        stateChange[state]();
    }
}

/**
 * @renderSurveyTimeline
 * Fetch all events from survey, and call render function
 */
function renderSurveyTimeline () {
    $.surveyTableView.data = [];
    var surveyId = libSurvey.activeSurvey().surveyId;
    eventCollection.fetch({
        query: 'SELECT * from events where survey_id = "' + surveyId + '"',
        success: function(collection, response, options) {
            eventCollection.each(onAddEvent);

            _.defer(function () {
                $.surveyTableView.scrollToIndex(eventCollection.length - 1, {animated: true, animationStyle: Titanium.UI.iPhone.RowAnimationStyle.TOP,  position: Titanium.UI.iPhone.TableViewScrollPosition.TOP});
            });
        },
        error: function(collection, response, options) {
            log.info('[surveys/survey] collection, response', response);
        }
    });
}

/**
 * @method setTrackLocationTimeForBackground
 * Set the trackLocationTime in variable to be used in background service
 * @param {String} trackLocationTime
 */
function setTrackLocationTimeForBackground (trackLocationTime) {
    Ti.App.Properties.setString('app-survey-trackLocationTime', trackLocationTime);
}

/**
 * @method pauseSurvey
 * Stop the survey if one is active
 * @return {[type]} [description]
 */
function pauseSurvey () {
    stopTime();
}

/**
 * @method continueSurvey
 * Continue survey
 */
function continueSurvey () {
    activateSurvey(libSurvey.activeSurvey());
}
