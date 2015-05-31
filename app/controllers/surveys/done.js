/**
 * Controller for surveys done
 *
 * Let the user know the survey is stored succesfully
 *
 * @class Controllers.surveys.comment
 * @uses utils.log
 * @uses notificatons
 * @uses survey
 */
var log = require('utils/log');
var notifications = require('notifications');
var survey = require('survey');
var dispatcher = require('dispatcher');

// Collections
var profiles = Alloy.createCollection('Profile');

_.extend($, {
    /**
     * @constructor
     * @method construct
     * @param {Object} config Controller configuration
     */
    construct: function(config) {
        require('windowManager').openWinWithBack($.getView());
        // @todo build in auto upload so we don't set the notification unintended.
        notifications.increase(1);
        // Lets Update the user
        var activeProfile = survey.getUser();
        profiles.fetch();
        var activeProfileModel = profiles.get(activeProfile.id);
        var numberOfSurveys = activeProfileModel.get('surveys') + 1;
        activeProfileModel.set('surveys', numberOfSurveys);
        activeProfileModel.save();
        dispatcher.trigger('profile:change');
        // Remove any reference to the survey
        require('survey').destroySurvey();
        // Trigger a update
        dispatcher.trigger('survey:change');
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
    $.getView().close({animated: true});
}


/**
 * @method doClickDone
 * Handle `click` on done butto
 */
function doClickDone () {
    require('flow').done();
}
