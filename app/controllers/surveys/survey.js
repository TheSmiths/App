/**
 * Controller for surveys survey
 *
 * @class Controllers.surveys.survey
 * @uses utils.log
 * @uses survey
 * @uses alloy.moment
 */
var log = require('utils/log');
var survey = require('survey');
var events = require('event');
var moment = require('alloy/moment');

// Internals
var startTime;
var endTime;
var timer;
var active = false;
var state = 'PREACTIVE';
var startedFromRoot = false;

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
            startedFromRoot = true;
            activateSurvey(survey.activeSurvey());
            state = 'ACTIVE';
        }

        require('windowManager').openWinWithBack($.getView());
    },

    /**
     * @method destruct
     * function executed when closing window
     */
    destruct: function() {
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

        require('survey').stopSurvey();

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

    log.info('[surveys/survey] Retreiving remainder');
    var remainder = endTime - new Date().getTime();

    // Stop the clock once its done
    if (remainder <= 0) {
        state = 'POSTACTIVE';
        updateViewState('POSTACTIVE');
        $.surveyTimer.text = '00:00';
        return;
    }

    log.info('[surveys/survey] Updating time');
    var remainingSeconds = remainder / 1000;
    var remainingMinutes = remainingSeconds / 60;
    var minutes = Math.floor(remainingMinutes);
    var seconds = Math.floor(remainingSeconds - minutes * 60);
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    $.surveyTimer.text = minutes + ':' + seconds;
    timer = _.delay(updateTime, 50);
}


/**
 * @method stopSurvey
 * Stop time and remove all reference to the survey
 */
function stopSurvey () {
    stopTime();
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
        }
    };


    if (_.contains(['PREACTIVE', 'ACTIVE', 'POSTACTIVE'], state)) {
        stateChange[state]();
    }
}

/**
 * @method doClickAddSighting
 * Handle `click` on addSighting, create sighting/material controller
 * @param  {Object} evt
 */
function doClickAddSighting (evt) {
    log.info('[surveys/survey] Started new sighting');
    //@todo move to flow library
    Alloy.createController('sighting/material', { parent: $ });
}

/**
 * @method doClickFinishSurvey
 * Handle `click`on doClickFinishSurvey, create sighting/material controller
 * @param  {[type]} evt [description]
 * @return {[type]}     [description]
 */
function doClickFinishSurvey (evt) {
   log.info('[surveys/survey] Finished survey');
   //@todo move to flow library
   Alloy.createController('surveys/windspeed', { flow: 'POSTSURVEY' });
}


function renderSurveyTimeline () {
    var surveyId = survey.activeSurvey().surveyId;
    eventCollection.fetch({
        query: 'SELECT * from events where survey_id = "' + surveyId + '"',
        success: function(collection, response, options) {
            log.info('[surveys/survey] collection, response', response);
        },
        error: function(collection, response, options) {
            log.info('[surveys/survey] collection, response', response);
        }
    });

}

