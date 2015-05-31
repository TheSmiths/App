/**
 * Controller for Settings
 *
 * @class Controllers.settings
 * @uses utils.log
 */
var log = require('utils/log');

// Internals
var unitSetting = "METRIC";

// Selectors
var selectors = {
    'METRIC': {
        selectedUnitContainer: $.surveyMetricMeterSettingContainer,
        selectedUnit: $.surveyUnitMetricSetting,
        selectedUnitCaption: $.surveyUnitMetricCaptionSetting
    },
    'IMPERIAL': {
        selectedUnitContainer: $.surveyMetricInchSettingContainer,
        selectedUnit: $.surveyUnitImperialSetting,
        selectedUnitCaption: $.surveyUnitImperialCaptionSetting
    }
};

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

        unitSetting = settings.unit || unitSetting;

        setUnit(unitSetting);
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
        trackingInterval: trackingInterval,
        unit: unitSetting
    };

    Ti.App.Properties.setObject('app-survey-settings', settingsObject);
}

function setUnit (localUnitSetting) {
    var previousUnit = localUnitSetting === "METRIC" ?  "IMPERIAL" : "METRIC";
    unitSetting = localUnitSetting;
    selectors[localUnitSetting].selectedUnitContainer.backgroundColor = Alloy.CFG.design.colors.mediumBlue;
    selectors[localUnitSetting].selectedUnit.color = "#fff";
    selectors[localUnitSetting].selectedUnitCaption.color = "#fff";
    selectors[previousUnit].selectedUnitContainer.backgroundColor = "#fff";
    selectors[previousUnit].selectedUnit.color =  Alloy.CFG.design.colors.mediumBlue;
    selectors[previousUnit].selectedUnitCaption.color =  Alloy.CFG.design.colors.mediumBlue;
}

/**
 * [onClickChangeMetric description]
 * @param  {[type]} evt [description]
 * @return {[type]}     [description]
 */
function onClickChangeMetric (evt) {
    if (unitSetting === evt.source.setting) {
        return;
    }

    setUnit(evt.source.setting);
}
