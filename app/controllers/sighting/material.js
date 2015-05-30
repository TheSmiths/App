/**
 * Controller for surveys sighting material
 *
 * @class Controllers.sighting.material
 * @uses utils.log
 * @uses event
 * @uses flow
 */
var log = require('utils/log');

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
 * @method closeWindow
 * Close current window
 */
function closeWindow (evt) {
    log.info('[sighting/material] Close window');
    $.getView().close({animated: true});
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
