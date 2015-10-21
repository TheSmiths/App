/**
 * Controller for the more window
 *
 * @class Controllers.more
 * @uses utils.log
 */
var log = require('utils/log');

/**
 * Initializes the controller
 */
_.extend($, {
    /**
     * @constructor
     * @method construct
     * @param {Object} config Controller configuration
     */
    construct: function(config) {

    },

    /**
     * @method destruct
     * function executed when closing window
     */
    destruct: function() {
    }
});

/**
 * @method onClickContactProject
 *
 * Open the email client and allow to send email to app@theoceancleanup.com
 * @param  {Object evt Event data
 */
function onClickContactProject (evt) {
    var emailDialog = Ti.UI.createEmailDialog()
    emailDialog.subject = "Feedback on Survey App";
    emailDialog.toRecipients = ['app@theoceancleanup.com'];
    emailDialog.open();
}

/**
 * @method onClickVisitTOC
 *
 * Handle `click` on  #visitTOC button
 *
 * @param  {Object} evt
 */
function onClickVisitTOC (evt) {
    Titanium.Platform.openURL('http://www.theoceancleanup.com');
}
