/**
 * Controller for the surveysRow componenent
 *
 * Generate tableView Row based on model data
 *
 * @class Controllers.components.surveysRow
 */
var moment = require('alloy/moment');
var profiles = Alloy.createCollection('Profile');

// Internals
var surveyId;
var startTime;
var endTime;

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

        profiles.fetch();

        var profile = profiles.get(model.get('observer_id'));

        surveyId = model.id;
        startTime = model.get('startTime');
        endTime = model.get('endTime');
        $.surveyDate.text = 'Survey from ' + moment(new Date(Math.floor(model.get('created')))).format('MMMM Do [at] HH:mm');
        $.userInfo.text = 'User #: ' + profile.get('name');
        $.uploaded.text = model.get('uploaded') == 1 ? 'Done' : ' Upload survey';
        $.uploaded.opacity = model.get('uploaded') == 1 ? 0.5 : 1;
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
