/**
 * Controller for Settings
 *
 * @class Controllers.settings
 * @uses utils.log
 * @uses toast
 */
var log = require('utils/log');
var toast = require('toast');

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
        unitSetting = settings && settings.unit ? settings.unit : unitSetting;
        setUnit(unitSetting);


        if (!Alloy.CFG.developmentVersion) {
            return;
        }

        if (!settings) {
            return;
        }

        // Set test settings
        $.surveyDuration.value = settings.surveyDuration;
        $.trackingInterval.value = settings.trackingInterval;
        $.testOptions.height = Ti.UI.SIZE;
        $.testOptions.visible = true;
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

/**
 * @method setUnit
 * Change appearance
 * @param {String} localUnitSetting
 */
function setUnit (localUnitSetting) {
    // Remember preivous
    var previousUnit = localUnitSetting === "METRIC" ? "IMPERIAL" : "METRIC";
    // Update styling
    selectors[localUnitSetting].selectedUnitContainer.backgroundColor = '#01CBE1';
    selectors[localUnitSetting].selectedUnit.color = "#fff";
    selectors[localUnitSetting].selectedUnitCaption.color = "#fff";
    selectors[previousUnit].selectedUnitContainer.backgroundColor = "#E8E8E8";
    selectors[previousUnit].selectedUnit.color =  '#6C6C6C';
    selectors[previousUnit].selectedUnitCaption.color =  '#6C6C6C';
}

/**
 * @method onClickChangeMetric
 * Handle click on the metric
 * @param  {Object} evt Event information
 */
function onClickChangeMetric (evt) {
    var unit = evt.source.setting;
    // If someone taps the currently selected don't do anything
    if (unitSetting === unit) {
        return;
    }
    // Update styling
    setUnit(unit);
    // Set current setting
    unitSetting = unit;
    // Save
    var settings = Ti.App.Properties.getObject('app-survey-settings');
    if (!settings) {
        settings = {};
    }
    settings.unit = unit;
    Ti.App.Properties.setObject('app-survey-settings', settings);
    // Show message to user
    toast.showToastMessage($, 'settings', L("settings.saved"));
}
