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
    $.eventInformationMessage.text = 'Started new survey';
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
    $.eventInformationMessage.text = 'Latitude: ' + readableCoordinates(eventData.latitude.toString()) + ', Longitude: ' + readableCoordinates(eventData.longitude.toString());
}

/**
 * @method displaySighting
 * Display eventRow as displaySighting event
 * @param  {Object} eventData
 * @param  {Object} surveyData
 */
function displaySighting (eventData, surveyData) {
    $.eventTime.text = ((eventData.eventTime - surveyData.startTime) / 60000).toFixed(1) ;
    $.eventInformationTitle.text = L('surveys.survey.event.sightingTitle');
    var totalTime = ((eventData.endTime - eventData.startTime) / 1000).toFixed(2);
    $.eventInformationMessage.text = 'Data: ' + eventData.material + ', ' + eventData.category + ', ' + eventData.dimension + ', ' + eventData.distance + '. Time: ' + totalTime + ' sec';
}

/**
 * @method displayFinishSurvey
 * Display eventRow as displayFinishSurvey event
 * @param  {Object} eventData
 * @param  {Object} surveyData
 */
function displayFinishSurvey (eventData, surveyData) {

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
