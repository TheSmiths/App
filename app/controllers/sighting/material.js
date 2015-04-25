/**
 * Controller for surveys sighting material
 *
 * @class Controllers.sighting.material
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
        $.grid.setData(require('data/material'));
        require('windowManager').openWinInNewWindow($.getView());
    },

    /**
     * @method destruct
     * function executed when closing window
     */
    destruct: function() {
    }
});

/**
 * @method closeWindow
 * Close current window
 */
function closeWindow (evt) {
    log.info('[sighting/material] Close window');
    require('windowManager').closeWin({animated: true});
}

/**
 * @method onClickGrid
 * Handle `click` on grid
 * @param  {Object} evt
 */
function onClickGrid (evt) {
    log.info('[sighting/material] Clicked on grid', evt.source, evt);
    Alloy.createController('sighting/category', { material: evt.source.componentId});
}
