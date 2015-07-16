/**
 * Controller for profiles newProfile
 *
 * @class Controllers.profiles.newProfile
 * @uses dispatcher
 */
var log = require('utils/log');
var WM = require('windowManager');
var dispatcher = require('dispatcher');
var toast = require('toast');

//Internals
var parent;
var state = 'PRESURVEY';

_.extend($, {
    /**
     * @constructor
     * @method construct
     * @param {Object} config Controller configuration
     */
    construct: function(config) {
        parent = config.parent;
        if (config.state) {
            state = config.state || state;
        }
        // If flow is survey start as standalone navigation group
        WM.openModal($.getView(), { title: L('coordinates.title') } );
        dispatcher.on('trackingLocation', closeCoordinates);
    },

    /**
     * @method destruct
     * function executed when closing window
     */
    destruct: function() {
        dispatcher.off('trackingLocation', closeCoordinates);
    }
});

/**
 * @method closeWindow
 * Close current window
 */
function closeWindow (evt) {
    $.getView().close({ animated : true });
}

/**
 * @method closeCoordinates
 * Found GPS coordinates, give preference over GPS than manual
 */
function closeCoordinates () {
    toast.showToastMessage($, 'surveys', L("coordinates.foundGPS"), true);
    dispatcher.trigger('survey:gps');
    closeWindow();
}

/**
 * @method saveCoordinates
 * Handle save of coordinates
 * @param  {[type]} evt [description]
 * @return {[type]}     [description]
 */
function saveCoordinates (evt) {
    var latitude = $.latitude.value.trim();
    var longitude = $.longitude.value.trim();

    if (latitude.length < 1 || longitude.length < 1) {
        alert('Please provide your coordinates to continue');
        return;
    }

    var coordinates = {
        latitude: latitude,
        longitude: longitude,
        manual: true
    };

    dispatcher.trigger('survey:coordinates', coordinates);
    closeWindow();
}
