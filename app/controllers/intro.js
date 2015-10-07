/**
 * Controller for the more window
 *
 * @class Controllers.more
 * @uses utils.log
 */
var log = require('utils/log');
var WM = require('windowManager');
var dispatcher = require('dispatcher');

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
        WM.openWinWithBack($.getView(), { animated: false, title: L('profiles.surveyTitle') });
        $.videoPlayer.addEventListener('complete', doClickContinue);
    },

    /**
     * @method destruct
     * function executed when closing window
     */
    destruct: function() {
        $.videoPlayer.removeEventListener('complete', doClickContinue);
    }
});

/**
 * @method doClickContinue
 * Handle `click` on continue
 * @param  {Object} evt Event object
 */
function doClickContinue (evt) {
    $.videoPlayer.stop();
    WM.closeWin();
}
