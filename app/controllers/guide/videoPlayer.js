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
        $.videoPlayerMain.addEventListener('complete', completeVideo);
    },

    /**
     * @method destruct
     * function executed when closing window
     */
    destruct: function() {
        $.videoPlayerMain.removeEventListener('complete', completeVideo);
    }
});

/*
 * completeVideo
 *
 * Close window after showing video
 */
function completeVideo () {
    WM.closeWin();
}
