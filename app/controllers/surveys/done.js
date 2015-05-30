/**
 * Controller for surveys done
 *
 * Let the user know the survey is stored succesfully
 *
 * @class Controllers.surveys.comment
 * @uses utils.log
 * @uses notificatons
 */
var log = require('utils/log');
var notifications = require('notifications');
var dispatcher = require('dispatcher');

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
    dispatcher.trigger('newSurvey');
    Titanium.UI.iPhone.setAppBadge(0);
    require('flow').done();
}
