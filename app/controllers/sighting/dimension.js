/**
 * Controller for surveys sighting dimension
 *
 * @class Controllers.sighting.dimension
 * @uses utils.log
 * @uses event
 * @uses flow
 */
var log = require('utils/log');

_.extend($, {
    /**
     * @constructor
     * @method construct
     * @param {Object} config Controller configuration
     */
    construct: function(config) {
        $.grid.setData(require('data/dimension'));
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
    log.info('[sighting/dimension] Close window');
    $.getView().close({animated: true});
}

/**
 * @method onClickGrid
 * Handle `click` on grid
 * @param  {Object} evt
 */
function onClickGrid (evt) {
    log.info('[sighting/dimension] Click on grid', evt);
    // Save data
    var dimension = evt.source.componentId;
    require('event').updateSurveyEventData('sighting', { dimension: dimension});
    // Continue flow
    require('flow').dimension();
}
