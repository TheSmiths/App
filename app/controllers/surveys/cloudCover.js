/**
 * Controller for surveys cloud cover
 *
 * @class Controllers.surveys.cloudCover
 * @uses utils.log
 */
var log = require('utils/log');
var WM = require('windowManager');

_.extend($, {
    /**
     * @constructor
     * @method construct
     * @param {Object} config Controller configuration
     */
    construct: function(config) {
        $.grid.setData(require('data/cloudCover'));
        WM.openWinWithBack($.getView());
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
    WM.closeWin({ animated : true });
}

/**
 * @method onClickGrid
 * Handle `click` on cloudCover grid
 * @param  {Object} evt
 */
function onClickGrid (evt) {
    log.info('[cloudCover] Clicked on grid', evt.source.componentId);
    require('flow').saveCloudCover({'cloudCover': evt.source.componentId});
}
