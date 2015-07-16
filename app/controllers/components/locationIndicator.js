var args = arguments[0] || {};
var dispatcher = require('dispatcher');

var LOCATION = false;
var ANIMATED = false;

_.extend($, {
    /**
     * @constructor
     * @method construct
     * @param {Object} config Controller configuration
     */
    construct: function(config) {
        dispatcher.on('trackingLocation', hideMessage);

        checkCoordinates();

        _.delay(function () {
            if (!checkCoordinates()) {
                if (config.direct) {
                    showMessageDirect();
                    return;
                }

                if (OS_IOS) {
                    showMessage();
                }

                if (OS_ANDROID) {
                    showMessageDirect();
                }
            }
        }, 1000);
    },

    /**
     * @method destruct
     * function executed when closing window
     */
    destruct: function() {
    }
});

/**
 * @method checkCoordinates
 * Check coordinates
 * @return {Boolean} Check if we have coordinates
 */
function checkCoordinates () {
    if (require('utils/location').getLocationsCoordinates()) {
        LOCATION = true;
        hideMessage();
        return true;
    }

    return false;
}

/**
 * @method doClickGPS
 * Handle click on GPS label
 */
function doClickGPS () {
     Alloy.createController('guide/guideDetail', { dialog: true, guideIndex: 2 });
}

/**
 * @method showMessageDirect
 * Show the locationIndicator direct (no animation)
 */
function showMessageDirect () {
    $.locationContainer.bottom = 0;
    $.locationContainer.visible = true;
}

/**
 * @method showMessage
 * Animate the locationIndicator into the view
 */
function showMessage () {
    var showMessage = Ti.UI.createAnimation({
        bottom: 0,
        duration : 400,
        autoreverse : false,
        visible: true
    });
    $.locationContainer.animate(showMessage);
}

/**
 * @method hideMessage
 * Hide the locationIndicator from the view
 */
function hideMessage () {
    if (OS_ANDROID) {
        $.locationContainer.bottom = -60;
        $.locationContainer.visible = false;
    }

    if (OS_IOS) {
        var removeMessage = Ti.UI.createAnimation({
            bottom: -60,
            duration : 400,
            autoreverse : false,
            visible: false
        });
        $.locationContainer.animate(removeMessage);
    }
}
