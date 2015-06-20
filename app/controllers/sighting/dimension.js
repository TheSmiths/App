/**
 * Controller for surveys sighting dimension
 *
 * @class Controllers.sighting.dimension
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
        var settings = Ti.App.Properties.getObject('app-survey-settings');
        var unitType  = settings && settings.unit === 'IMPERIAL' ? 'IMPERIAL' : 'METRIC';
        $.grid.setData(require('data/dimension')[unitType]);
        WM.openWinWithBack($.getView(), {title: L('sighting.dimension.title')});

        if (sightingType === "MULTI") {
            $.headerSubTitle.text = L('sighting.dimension.subTitleMulti');
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
 * Handle `click` on backButton
 */
function onClickBackButton () {
    log.info('[sighting/dimension] Close window');
    WM.closeWin({ animated : true });
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
    require('flow').dimension(sightingType);
}
