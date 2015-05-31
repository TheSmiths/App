_.extend($, {
    /**
     * @constructor
     * @method construct
     * @param {Object} config Controller configuration
     */
    construct: function(config) {
        var eventType = config.model.get('type');
        var eventData = JSON.parse(config.model.get('data'));
        var surveyData = require('survey').activeSurvey();

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
    $.eventInformationMessage.text = 'Latitude: ' + readableCoordinates(eventData.startLocation.latitude.toString()) + ', Longitude: ' + readableCoordinates(eventData.startLocation.longitude.toString());;
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
    $.eventInformationMessage.text = 'Latitude: ' + readableCoordinates(eventData.location.latitude.toString()) + ', Longitude: ' + readableCoordinates(eventData.location.longitude.toString());
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
    var totalTime = ((eventData.endTime - eventData.startTime) / 1000).toFixed(2);
    var materialText = require('data/material')[eventData.material].valueLabel;
    var dimensionText = require('data/dimension')[eventData.dimension];
    var distanceText = require('data/distance')[eventData.distance];

    $.eventRow.height = 65;
    $.eventContainer.height = 55;
    $.eventTimeContainer.height = 55;
    $.eventInformation.height = 55;

    if (eventData.sightingType === 0) {
        // Retreive sighting text
        var categoryText = require('data/category')[eventData.material][eventData.category].valueLabel;
        $.eventInformationMessage.text = materialText + " " + categoryText + " of " + dimensionText.valueLabel + " " + dimensionText.captionLabel.toLowerCase() + " located " + distanceText.valueLabel + " " + distanceText.captionLabel.toLowerCase() + " from boat.";
        return;
    }

    $.eventInformationMessage.text = "Mainly containing " + materialText + " and average size " + dimensionText.valueLabel + " " + dimensionText.captionLabel.toLowerCase() + " located " + distanceText.valueLabel + " " + distanceText.captionLabel.toLowerCase() + " from boat.";
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
    $.eventInformationMessage.text = 'Latitude: ' + readableCoordinates(eventData.endLocation.latitude.toString()) + ', Longitude: ' + readableCoordinates(eventData.endLocation.longitude.toString());
}

/**
 * @method readableCoordinates
 * Convert lat/lng to readable string that fits into the stream
 * @param  {String} coordinates Lat / Lng String from system
 * @return {String} coordinates Readable coordinates string
 */
function readableCoordinates (coordinates) {
    return coordinates.substring(0, coordinates.length - 10);
}
