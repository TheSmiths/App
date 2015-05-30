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
var dispatcher = require('dispatcher');

_.extend($, {
    /**
     * @constructor
     * @method construct
     * @param {Object} config Controller configuration
     */
    construct: function(config) {
        $.grid.setData(require('data/distance'));
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
    // Get current time
    var sightingEndTime = new Date().getTime();
    // Request location from system
    require('utils/location').getCurrentLatLng(function (error, locationObject) {
        var dataObject = {};
        // Add time to object
        dataObject.distance = distance;
        dataObject.endTime = sightingEndTime;
        dataObject.endLocation = locationObject;
        // Track event
        require('event').saveSurveyEvent('sighting', dataObject);
        // Update the flow
        dispatcher.trigger('surveyUpdate');
        // Continue flow
        require('flow').distance();
    });
}
