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
    $.eventTime.text = '0'; //always 0
    $.eventInformationTitle.text = 'Tracked Survey';
    $.eventInformationMessage.text = '... Need to fix this';
}

/**
 * @method displaySighting
 * Display eventRow as displaySighting event
 * @param  {Object} eventData
 * @param  {Object} surveyData
 */
function displaySighting (eventData, surveyData) {

}

/**
 * @method displayFinishSurvey
 * Display eventRow as displayFinishSurvey event
 * @param  {Object} eventData
 * @param  {Object} surveyData
 */
function displayFinishSurvey (eventData, surveyData) {

}
