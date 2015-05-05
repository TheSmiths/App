/**
 * Controller for surveys cloud cover
 *
 * @class Controllers.surveys.cloudCover
 * @uses utils.log
 */
var log = require('utils/log');

// STATE PRESURVEY or POSTSURVEY
var STATE = 'PRESURVEY';

_.extend($, {
    /**
     * @constructor
     * @method construct
     * @param {Object} config Controller configuration
     */
    construct: function(config) {
        STATE = config.flow || STATE;
        $.grid.setData(require('data/cloudCover'));
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
    $.getView().close({animated: true});
}

/**
 * @method onClickGrid
 * Handle `click` on cloudCover grid
 * @param  {Object} evt
 */
function onClickGrid (evt) {
    log.info('[cloudCover] Clicked on grid', evt.source.componentId);
    require('flow').saveCloudCover(STATE, {'cloudCover': evt.source.componentId});
}
