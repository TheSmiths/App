/**
 * Controller for surveys sighting category
 *
 * @class Controllers.sighting.category
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
        //log.info('Checking config', config);
        console.log('********', config.material)
        $.grid.setData(require('data/category')[config.material]);
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
 * Handle `click` on grid
 * @param  {Object} evt
 */
function onClickGrid (evt) {
    log.info('[windspeed] Click on grid', evt);
    Alloy.createController('sighting/dimension');
}
