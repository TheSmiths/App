/**
 * Controller for surveys sightingType
 *
 * @class Controllers.sighting.sightingType
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
        //Get category based on material
        $.grid.setData(require('data/sightingType'));
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
 * @method onClickBackButton
 * Handle `click` on backButton
 */
function onClickBackButton () {
    log.info('[sighting/category] Close window');
    require('event').destroySurveyEvent();
    log.info('[sighting/material] Close window');
    require('windowManager').closeWin({animated: true});
}

/**
 * @method onClickGrid
 * Handle `click` on grid
 * @param  {Object} evt
 */
function onClickGrid (evt) {
    log.info('[sighting/category] Click on grid', evt);
    // Save event
    var sightingType = evt.source.componentId;
    require('event').updateSurveyEventData('sighting', { sightingType: sightingType});
    // Continue flow
    var sightingTypeName = sightingType === 0 ? "SINGLE" : "MULTI";
    require('flow').sightingType(sightingTypeName);
}
