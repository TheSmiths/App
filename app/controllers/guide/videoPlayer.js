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
        WM.openWinInNewWindow($.getView(), { title: config.title });
        $.videoPlayer.addEventListener('complete', completeVideo);
    },

    /**
     * @method destruct
     * function executed when closing window
     */
    destruct: function() {
        $.videoPlayer.removeEventListener('complete', completeVideo);
    }
});

function completeVideo () {
    WM.closeWin();
}
