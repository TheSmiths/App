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
var survey = require('survey');
var events = require('event');
var moment = require('alloy/moment');
var dispatcher = require('dispatcher');

// Settings
var settings = Ti.App.Properties.getObject('app-survey-settings');

// Internals
var startTime;
var endTime;
var timer;
var active = false;
var state = 'PREACTIVE';
var startedFromRoot = false;

// constants
var TRACKTIMEINTERVAL = settings ? settings.trackingInterval * 60 : Alloy.CFG.intervalDuration * 60;

// Collections
var eventCollection = Alloy.createCollection('Event');
var shadowEvents = [];

_.extend($, {
    /**
     * @constructor
     * @method construct
     * @param {Object} config Controller configuration
     */
    construct: function(config) {
        // Set state (e.g. started from active or inactive)
        if (config.startedFromRoot) {
            startedFromRoot = true;
            activateSurvey(survey.activeSurvey());
            state = 'ACTIVE';
        }

        if (!config.startedFromRoot) {
            var totalTime = settings ? settings.surveyDuration : Alloy.CFG.surveyDuration;
            $.surveyTimer.text = totalTime + ':00';
        }
        // open window
        require('windowManager').openWinWithBack($.getView());

        //Listners
        dispatcher.on('surveyUpdate', renderSurveyTimeline);

        var TRACKLOCATIONTIME = settings ? ( settings.surveyDuration * 60 -  settings.trackingInterval * 60 ) : (Alloy.CFG.surveyDuration * 60 - Alloy.CFG.intervalDuration * 60);
        setTrackLocationTimeForBackground(TRACKLOCATIONTIME);

        // Listen to event
        if (OS_IOS) {
            Ti.App.addEventListener('pause', pauseSurvey);
            Ti.App.addEventListener('resume', continueSurvey);
        }
    },

    /**
     * @method destruct
     * function executed when closing window
     */
    destruct: function() {
        dispatcher.off('surveyUpdate', renderSurveyTimeline);

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

        require('survey').cancelSurvey();

        if (startedFromRoot) {
            Alloy.createController('index');
        }

        require('windowManager').closeWin({animated: true});
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

    require('utils/location').getCurrentLatLng(function (err, currentLocation) {
        if (err) {
            log.error('[surveys/survey] Unable to determine location, without location the survey is unable to continue');
            alert('Unable to determine location, without location the survey is unable to continue');
            return;
        }
        // Start survey
        var surveyObject = survey.startSurvey();
        var currentTime = new Date().getTime();

        // Move location error to the library
        events.saveSurveyEvent('startSurvey', {startingTime: currentTime, startLocation: currentLocation});
        activateSurvey(surveyObject);
    });
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
    // Request location from system
    require('utils/location').getCurrentLatLng(function (error, locationObject) {
        var dataObject = {};
        // Add time to object
        dataObject.startTime = sightingStartTime;
        dataObject.startLocation = locationObject;
        // Track event
        events.initSurveyEvent('sighting', dataObject);
        require('flow').sighting();
    });
}

/**
 * @method doClickFinishSurvey
 * Handle `click`on doClickFinishSurvey, create sighting/material controller
 * @param  {Object} evt
 */
function doClickFinishSurvey (evt) {
    events.initSurveyEvent('finishSurvey');
    log.info('[surveys/survey] Finished survey');
    require('flow').postSurvey(startedFromRoot);
}

/**
 * @method onAddEvent
 * Add event model to survyeTableView
 * @param  {Object} model
 */
function onAddEvent (model) {
    // Filter out duplicates
    if (_.contains(shadowEvents, model.get('event_id'))) {
        return;
    }

    log.info('[surveys/survey] Tracking onAddedEvent', model.attributes);

    var eventDataView = Alloy.createController('surveys/surveyRow', {model: model}).getView();
    $.surveyTableView.appendRow(eventDataView);
    $.surveyTableView.height = Ti.UI.FILL;
    shadowEvents.push(model.get('event_id'));
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
    survey.stopSurvey();
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
        state = 'POSTACTIVE';
        updateViewState('POSTACTIVE');
        $.surveyTimer.text = '00:00';
        survey.stopSurvey();
        Ti.Media.vibrate();
        return;
    }

    var remainingSeconds = remainder / 1000;
    // Retreive the Tracklocation time from memory as it might have been changed by the background service
    var TRACKLOCATIONTIME = Ti.App.Properties.getString('app-survey-trackLocationTime');

    // Track location
    if (remainingSeconds < TRACKLOCATIONTIME && TRACKLOCATIONTIME > 0) {
        survey.trackLocation();
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




/**
 * @method stopSurvey
 * Stop time and remove all reference to the survey
 */
function stopSurvey () {
    stopTime();
    Ti.App.removeEventListener('survey:updated', renderSurveyTimeline);
    survey.stopSurvey();
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
    var surveyId = survey.activeSurvey().surveyId;
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
    activateSurvey(survey.activeSurvey());
}
