/**
 * Controller for surveys windspeed
 *
 * @class Controllers.surveys.windspeed
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
        // Set data
        $.grid.setData(require('data/windSpeed'));
        // Open
        WM.openWinWithBack($.getView(), {title: L('surveys.windspeed.title')});
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
    log.info('[windspeed] Close window');
    WM.closeWin({ animated : true });
}

/**
 * @method onClickGrid
 * Handle `click` on  windspeed grid
 * @param  {Object} evt
 */
function onClickGrid (evt) {
    log.info('[windspeed] Click on grid item ', evt.source.componentId);
    require('flow').saveWindspeed({'windspeed': evt.source.componentId});
}
