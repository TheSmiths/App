/**
 * Controller for Settings
 *
 * @class Controllers.settings
 * @uses utils.log
 */
var log = require('utils/log');


_.extend($, {
    /**
     * @constructor
     * @method construct
     * @param {Object} config Controller configuration
     */
    construct: function(config) {
        var settings = Ti.App.Properties.getObject('app-survey-settings');

        if (!settings) {
            return;
        }

        $.surveyDuration.value = settings.surveyDuration;
        $.trackingInterval.value = settings.trackingInterval;
    },

    /**
     * @method destruct
     * function executed when closing window
     */
    destruct: function() {
    }
});

/**
 * @method onChangeSurveyDuration
 * Update the text to represent the change in slider
 */
function onChangeSurveyDuration (evt) {
    var minutes = Math.floor(evt.value);
    $.duration.text = minutes + ' minutes';
}

/**
 * @method onChangeTrackingInterval
 * Update the text to represent the change in slider
 */
function onChangeTrackingInterval (evt) {
    var minutes = Math.floor(evt.value);
    $.interval.text = minutes + ' minutes';
}

/**
 * [onClickSaveSettings description]
 * @return {[type]} [description]
 */
function onClickSaveSettings () {
    var surveyDuration = Math.floor($.surveyDuration.value) || 0;
    var trackingInterval = Math.floor($.trackingInterval.value) || 0;
    var settingsObject = {
        surveyDuration: surveyDuration,
        trackingInterval: trackingInterval
    };

    Ti.App.Properties.setObject('app-survey-settings', settingsObject);
}
