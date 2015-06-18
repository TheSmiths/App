/**
 * Controller for surveys sighting material
 *
 * @class Controllers.sighting.material
 * @uses utils.log
 * @uses event
 * @uses flow
 */
var log = require('utils/log');
var WM = require('windowManager');

//Internals
var sightingType;

_.extend($, {
    /**
     * @constructor
     * @method construct
     * @param {Object} config Controller configuration
     */
    construct: function(config) {
        sightingType = config.sightingType;
        $.grid.setData(require('data/material'));
        WM.openWinWithBack($.getView(), {title: L('sighting.material.title')});

        if (sightingType === "MULTI") {
            $.headerSubTitle.text = L('sighting.material.subTitleMulti');
        }
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
 * Close current window
 */
function onClickBackButton (evt) {
    log.info('[sighting/material] Close window');
    WM.closeWin({ animated : true });
}

/**
 * @method onClickGrid
 * Handle `click` on grid
 * @param  {Object} evt
 */
function onClickGrid (evt) {
    log.info('[sighting/material] Clicked on grid', evt.source, evt);
    var material = evt.source.componentId;
    require('event').updateSurveyEventData('sighting', {material: material});
    require('flow').material(material, sightingType);
}
