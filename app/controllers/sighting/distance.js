/**
 * Controller for surveys sighting distance
 *
 * @class Controllers.sighting.distance
 * @uses utils.log
 * @uses event
 * @uses flow
 * @uses dispatcher
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
        $.grid.setData(require('data/distance'));
        require('windowManager').openWinWithBack($.getView());

        if (sightingType === "MULTI") {
            $.headerSubTitle.text = L('sighting.distance.subTitleMulti');
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
    log.info('[sighting/distance] Close window');
    $.getView().close({animated: true});
}

/**
 * @method onClickGrid
 * Handle `click` on grid
 * @param  {Object} evt
 */
function onClickGrid (evt) {
    log.info('[sighting/distance] Click on grid', evt);
    var distance = evt.source.componentId;
    require('event').updateSurveyEventData('sighting', {distance: distance});
    require('flow').distance(sightingType);
}
