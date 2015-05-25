/**
 * Controller for surveyDetails
 *
 * @class Controllers.surveyInfo.survenDetails
 * @uses utils.log
 */
var log = require('utils/log');

// Collections
var eventCollection = Alloy.createCollection('Event');

// Internals
var created;

_.extend($, {
    /**
     * @constructor
     * @method construct
     * @param {Object} config Controller configuration
     */
    construct: function(config) {
        // Set state
        var surveyId = config.surveyId;

        created = config.created;

        fetchSurveyEvents(surveyId);

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
 * @method onClickBackButton
 * Handle `click` on backButton
 */
function onClickBackButton () {
    require('windowManager').closeWin({animated: true});
}

/**
 * @method onAddEvent
 * Add event model to survyeTableView
 * @param  {Object} model
 */
function onAddEvent (model) {
    // Filter out duplicates
    log.info('[surveyInfo/surveyDetails] onAddedEvent', model.attributes);

    var eventDataView = Alloy.createController('surveys/surveyRow', {model: model, created: created}).getView();
    $.surveyTableView.appendRow(eventDataView);
    $.surveyTableView.height = Ti.UI.FILL;
}


function fetchSurveyEvents (surveyId) {
    eventCollection.fetch({
        query: 'SELECT * from events where survey_id = "' + surveyId + '"',
        success: function(collection, response, options) {
            log.info('[surveyInfo/surveyDetails] collection, response', collection, response);
            eventCollection.each(onAddEvent);
        },
        error: function(collection, response, options) {
            log.info('[surveyInfo/surveyDetails] collection, response', response);
        }
    });
}
