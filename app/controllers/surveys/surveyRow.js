var dispatcher = require('dispatcher');
var log = require('utils/log');

// Internals
var model;

_.extend($, {
    /**
     * @constructor
     * @method construct
     * @param {Object} config Controller configuration
     */
    construct: function(config) {
        var settings = Ti.App.Properties.getObject('app-survey-settings');
        var eventType = config.model.get('type');
        var eventData = JSON.parse(config.model.get('data'));
        var surveyData = require('surveyManager').activeSurvey();
        model = config.model;

        if (config.startTime && config.endTime ) {
            surveyData = {};
            surveyData.startTime = config.startTime;
            surveyData.endTime = config.endTime;
        }

        var display = {
            'startSurvey': displayStartSurvey,
            'track': displayTrack,
            'sighting': displaySighting,
            'finishSurvey': displayFinishSurvey
        };

        display[eventType](eventData, surveyData);
    },

    /**
     * @method destruct
     * function executed when closing window
     */
    destruct: function() {

    }
});

/**
 * @method displayStartSurvey
 * Display eventRow as startSurvey event
 * @param  {Object} eventData
 * @param  {Object} surveyData
 */
function displayStartSurvey (eventData, surveyData) {
    $.eventTime.text = '0'; //always 0
    $.eventInformationTitle.text = 'Started Survey';

    if (eventData.startLocation) {
        $.eventInformationMessage.text = 'Latitude: ' + readableCoordinates(eventData.startLocation.latitude.toString()) + ', Longitude: ' + readableCoordinates(eventData.startLocation.longitude.toString());;
    }
}

/**
 * @method displayTrack
 * Display eventRow as displayTrack event
 * @param  {Object} eventData
 * @param  {Object} surveyData
 */
function displayTrack (eventData, surveyData) {
    $.eventTime.text = ((eventData.eventTime - surveyData.startTime) / 60000).toFixed(1) ;
    $.eventInformationTitle.text = L('surveys.survey.event.trackTitle');
    if (eventData.location) {
        $.eventInformationMessage.text = 'Latitude: ' + readableCoordinates(eventData.location.latitude.toString()) + ', Longitude: ' + readableCoordinates(eventData.location.longitude.toString());
    } else {
        $.eventInformationMessage.text = L('surveys.survey.event.noLocation');
    }
}

/**
 * @method displaySighting
 * Display eventRow as displaySighting event
 * @param  {Object} eventData
 * @param  {Object} surveyData
 */
function displaySighting (eventData, surveyData) {
    $.eventTime.text = ((eventData.eventTime - surveyData.startTime) / 60000).toFixed(1) ;
    $.eventInformationTitle.text = eventData.sightingType === 0 ? L('surveys.survey.event.sightingTitle') : L('surveys.survey.event.sightingMultiTitle');
    var settings = Ti.App.Properties.getObject('app-survey-settings');
    var unitType  = settings && settings.unit === 'IMPERIAL' ? 'IMPERIAL' : 'METRIC';
    var totalTime = ((eventData.endTime - eventData.startTime) / 1000).toFixed(2);
    var materialText = require('data/material')[eventData.material].valueLabel;
    var dimensionText = require('data/dimension')[unitType][eventData.dimension];
    var distanceText = require('data/distance')[unitType][eventData.distance];

    $.eventRow.height = 65;
    $.eventContainer.height = 55;
    $.eventTimeContainer.height = 55;
    $.eventInformation.height = 55;

    if (eventData.sightingType === 0) {
        /*
        *    Retreive sighting category
        */

        // bart edit
        var bcat = require("data/category")[eventData.material];
        for (i = 0; i < bcat.length; i++) {
            if (bcat[i].id === eventData.category){
                var categoryText = bcat[i].valueLabel;
            }
        }
        // end bart edit. Original code:
        //var categoryText = require('data/category')[eventData.material][eventData.category].valueLabel;

        /*
        *    Make all sighting text
        */

        // Bart edit starts here
        var textString = materialText;
        if (bcat.length > 1){
            textString = textString + " " + categoryText;
        }
        $.eventInformationMessage.text = textString + " of " + dimensionText.valueLabel + " " + dimensionText.captionLabel + " located " + distanceText.valueLabel + " " + distanceText.captionLabel + " from boat.";
        // End bart edit. Original code:
        //$.eventInformationMessage.text = materialText + " " + categoryText + " of " + dimensionText.valueLabel + " " + dimensionText.captionLabel + " located " + distanceText.valueLabel + " " + distanceText.captionLabel + " from boat.";
        return;
    }

    $.eventInformationMessage.text = "Mainly containing " + materialText + " and average size " + dimensionText.valueLabel + " " + dimensionText.captionLabel + " located " + distanceText.valueLabel + " " + distanceText.captionLabel + " from boat.";
}

/**
 * @method displayFinishSurvey
 * Display eventRow as displayFinishSurvey event
 * @param  {Object} eventData
 * @param  {Object} surveyData
 */
function displayFinishSurvey (eventData, surveyData) {
    $.eventTime.text = surveyData.endTime ? ((surveyData.endTime - surveyData.startTime) / 60000).toFixed(1) : '30';
    $.eventInformationTitle.text = 'Finished Survey';
    if (eventData.endLocation) {
        $.eventInformationMessage.text = 'Latitude: ' + readableCoordinates(eventData.endLocation.latitude.toString()) + ', Longitude: ' + readableCoordinates(eventData.endLocation.longitude.toString());
    }
}

/**
 * @method readableCoordinates
 * Convert lat/lng to readable string that fits into the stream
 * @param  {String} coordinates Lat / Lng String from system
 * @return {String} coordinates Readable coordinates string
 */
function readableCoordinates (coordinates) {
    var limit = Math.min(5, coordinates.length);
    return coordinates.substring(0, limit);
}

/**
 * @method doClickSurveyRow
 * Handle click on survey row, and show delete if right type
 * @param  {Object} evt
 * @return {[type]}     [description]
 */
function doClickSurveyRow (evt) {
    // Check if we have an actual profile
    if (!model) {
        log.error('[surveys/surveyRow] Unable to find model')
        alert(L('surveys.errorDeletingSighting'));
        return;
    }

    if (model.get('type') !== 'sighting') {
        log.info('[surveys/surveyRow] Type is not equal to sighting, return.');
        return;
    }

    $.eventRow.opacity = 0.6;
    _.delay(function () {
         $.eventRow.opacity = 1;
    }, 400);

    // Create dialog to confirm delete
    var dialog = Ti.UI.createAlertDialog({
        cancel: 1,
        buttonNames: [L('surveys.deleteSighting'), L('surveys.deleteSightingCancel')],
        message: L('surveys.deleteSightingMessage'),
        title:  L('surveys.deleteSightingTitle')
    });

    dialog.addEventListener('click', function(evt) {
        if (evt.index === evt.source.cancel){
            return;
        }

        log.info('[surveyRow] Removing model with id ', model.id);
        model.destroy();
        // Show message to user
        dispatcher.trigger('survey:delete');
    });

    dialog.show();
}
