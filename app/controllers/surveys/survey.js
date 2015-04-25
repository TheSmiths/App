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

_.extend($, {
    /**
     * @constructor
     * @method construct
     * @param {Object} config Controller configuration
     */
    construct: function(config) {
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
        stopTime();
        require('windowManager').closeWin({animated: true});
    });

    dialog.show();
}

function doClickStartSurvey (evt) {
    log.info('[survey] Started survey');
    var surveyTimeObject = survey.startSurvey();
    startClock(surveyTimeObject);
    updateViewState('RUNNING');
}

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
 * [stopTime description]
 * @return {[type]} [description]
 */
function stopTime () {
    survey.stopSurvey();
    active = false;
    clearTimeout(timer);
}

/**
 * [updateViewState description]
 * @return {[type]} [description]
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
 * [doClickFinishSurvey description]
 * @param  {[type]} evt [description]
 * @return {[type]}     [description]
 */
function doClickFinishSurvey (evt) {
    //@todo finish
}

