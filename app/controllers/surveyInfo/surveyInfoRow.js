/**
 * Controller for the surveysRow componenent
 *
 * Generate tableView Row based on model data
 *
 * @class Controllers.components.surveysRow
 */
var moment = require('alloy/moment');

// Internals
var surveyId;
var created;

_.extend($, {
    /**
     * @constructor
     * @method construct
     * @param {Object} config Controller configuration
     */
    construct: function(config) {
        var model = config.model;

        if (!model) {
            return;
        }

        surveyId = model.id;
        created = Math.floor(model.get('created'));
        $.surveyDate.text = 'Survey from ' + moment(new Date(created)).format('MMMM Do [at] HH:mm');
        $.userInfo.text = 'User #: ' + model.get('observer_id');
    },

    /**
     * @method destruct
     * function executed when closing window
     */
    destruct: function() {

    }
});

function onClickSurvey () {
    Alloy.createController('surveyInfo/surveyDetails', { surveyId: surveyId, created: created });
}
