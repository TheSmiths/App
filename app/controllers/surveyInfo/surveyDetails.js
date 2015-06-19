/**
 * Controller for surveyDetails
 *
 * @class Controllers.surveyInfo.survenDetails
 * @uses utils.log
 */
var log = require('utils/log');

// Collections
var eventCollection = Alloy.createCollection('Event');
var WM = require('windowManager');

// Internals
var startTime;
var endTime;

_.extend($, {
    /**
     * @constructor
     * @method construct
     * @param {Object} config Controller configuration
     */
    construct: function(config) {
        startTime = config.startTime;
        endTime = config.endTime;
        fetchSurveyEvents(config.surveyId);
        WM.openWinWithBack($.getView(), {title: L('surveyDetails.title')});
    },

    /**
     * @method destruct
     * function executed when closing window
     */
    destruct: function() {

    }
});

/**
 * @method onClickBackButton
 * Handle `click` on backButton
 */
function onClickBackButton () {
    WM.closeWin({animated: true});
}

/**
 * @method addEvent
 * Add event model to survyeTableView
 * @param  {Object} model
 */
function addEvent (model) {
    // Filter out duplicates
    log.info('[surveyInfo/surveyDetails] onAddedEvent', model.attributes);

    var eventDataView = Alloy.createController('surveys/surveyRow', {model: model, startTime: startTime, endTime: endTime}).getView();
    $.surveyTableView.appendRow(eventDataView);
    $.surveyTableView.height = Ti.UI.FILL;
}

/**
 * @method fetchSurveyEvents
 *
 * Fetch events based on survey id
 *
 * @param  {String} surveyId Id of the survye to fetch
 */
function fetchSurveyEvents (surveyId) {
    eventCollection.fetch({
        query: 'SELECT * from events where survey_id = "' + surveyId + '"',
        success: function(collection, response, options) {
            log.info('[surveyInfo/surveyDetails] collection, response', collection, response);
            eventCollection.each(addEvent);
        },
        error: function(collection, response, options) {
            log.info('[surveyInfo/surveyDetails] collection, response', response);
        }
    });
}
