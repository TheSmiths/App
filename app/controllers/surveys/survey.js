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
var moment = require('alloy/moment');

// Internals
var startTime;
var endTime;
var timer;
var active = false;
var state = 'INACTIVE';

_.extend($, {
    /**
     * @constructor
     * @method construct
     * @param {Object} config Controller configuration
     */
    construct: function(config) {
        // Set state (e.g. started from active or inactive)
        if (config.state) {
            state = config.state;
        }

        // Check if we have an active survey, if so reactive clock
        if (state === 'ACTIVE') {
            startSurvey(survey.activeSurvey());
        }
        //@todo do a check if we have a running survey, if so update the clock
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
        if (state === 'ACTIVE') {
            Alloy.createController('index');
        }
        require('windowManager').closeWin({animated: true});
    });

    dialog.show();
}

/**
 * [doClickStartSurvey description]
 * @param  {[type]} evt [description]
 * @return {[type]}     [description]
 */
function doClickStartSurvey (evt) {
    log.info('[survey] Clicked start survey');
    startSurvey(survey.startSurvey());
}

/**
 * [startSurvey description]
 * @return {[type]} [description]
 */
function startSurvey(surveyTimeObject) {
    log.info('[survey] Started survey', surveyTimeObject);
    var currentTime = new Date().getTime();
    if (currentTime < surveyTimeObject.endTime) {
        startClock(surveyTimeObject);
        updateViewState('RUNNING');
        return;
    }

    updateViewState('FINISHED');
}



/**
 * [startClock description]
 * @param  {[type]} surveyTimeObject [description]
 * @return {[type]}                  [description]
 */
function startClock (surveyTimeObject) {
    startTime = surveyTimeObject.startTime;
    endTime = surveyTimeObject.endTime;
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

    log.info('Updating time');
    var remainder = endTime - new Date().getTime();
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
function updateViewState() {
    // Remove presurvey item
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
}

/**
 * @method doClickAddSighting
 * Handle `click` on addSighting, create sighting/material controller
 * @param  {Object} evt
 */
function doClickAddSighting (evt) {
    log.info('[surveys/survey] Started new sighting');
    Alloy.createController('sighting/material');
}

/**
 * @method doClickFinishSurvey
 * Handle `click`on doClickFinishSurvey, create sighting/material controller
 * @param  {[type]} evt [description]
 * @return {[type]}     [description]
 */
function doClickFinishSurvey (evt) {
    //@todo finish
}

