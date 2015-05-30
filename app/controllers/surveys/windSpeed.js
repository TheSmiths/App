/**
 * Controller for surveys windspeed
 *
 * @class Controllers.surveys.windspeed
 * @uses utils.log
 */
var log = require('utils/log');

_.extend($, {
    /**
     * @constructor
     * @method construct
     * @param {Object} config Controller configuration
     */
    construct: function(config) {
        // Set data
        $.grid.setData(require('data/windspeed'));
        // Open
        require('windowManager').openWinWithBack($.getView());
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
    $.getView().close({animated: true});
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
