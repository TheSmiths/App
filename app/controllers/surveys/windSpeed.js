/**
 * Controller for surveys windspeed
 *
 * @class Controllers.surveys.windspeed
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
    if (STATE === 'POSTSURVEY') {
        return require('windowManager').closeWin({animated: true});
    }
    $.getView().close({animated: true});
}

/**
 * @method onClickGrid
 * Handle `click` on  windspeed grid
 * @param  {Object} evt
 */
function onClickGrid (evt) {
    log.info('[windspeed] Click on grid item ', evt.source.componentId);
    require('flow').saveWindspeed(STATE, {'windspeed': evt.source.componentId});
}
