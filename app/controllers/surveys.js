/**
 * Controller for Settings
 *
 * @class Controllers.settings
 * @uses Utils.log
 * @uses Utils.date
 */
var log = require('utils/log'),
    date = require('utils/date');

_.extend($, {
    /**
     * @constructor
     * @method construct
     * @param {Object} config Controller configuration
     */
    construct: function(config) {
        log.debug('Booted Surveys');
        $.getView().addEventListener('open', populateWindow);
        Ti.Geolocation.addEventListener("heading", compassEventHandler);
        updateTime();
    },

    /**
     * @method destruct
     * function executed when closing window
     */
    destruct: function() {
        Ti.Geolocation.removeEventListener("heading", compassEventHandler);
    }
});

/**
 * @method populateWindow
 * @return {[type]} [description]
 */
function populateWindow () {
    if (!Ti.Geolocation.locationServicesEnabled) {
        log.error('[surveys] Please enable location services');
    }

    if (Ti.Platform.name == "iPhone OS" && parseInt(Ti.Platform.version.split(".")[0]) >= 8) {
        Ti.App.iOS.registerUserNotificationSettings({
            types: [
                Ti.App.iOS.USER_NOTIFICATION_TYPE_ALERT,
                Ti.App.iOS.USER_NOTIFICATION_TYPE_SOUND,
                Ti.App.iOS.USER_NOTIFICATION_TYPE_BADGE
            ]
        });
    }

    // @TODO: Cleanup the current position code
    Ti.Geolocation.getCurrentPosition(function (e) {
        if (!e.success || e.error){
            log.error(e.error);
            return;
        }

        var longitude = e.coords.longitude.toString();
        var latitude = e.coords.latitude.toString();
        var altitude = e.coords.altitude;

        var longitudeLength = longitude.length;
        var latitudeLength = latitude.length;

        if (longitudeLength > 8) {
            longitude = longitude.substring(0, longitudeLength );
        }

        longitude = longitude.substring(0, longitude.length - 10);
        latitude = latitude.substring(0, latitude.length - 10);

        var accuracy = e.coords.accuracy;
        var speed = e.coords.speed;
        var speedText = '0 knots';

        if (speed > 0) {
            speedText = require('utils/conversion').knots(speed);
        }

        $.headerCurrentSpeed.text = speedText;
        $.headerCurrentLocation.text = 'lng ' + longitude + ' lat ' +  latitude;
    });
}

/**
 * @method updateTime
 * Update time in surveys
 */
function updateTime () {
    $.headerCurrentTime.text = date.getCurrentTime();
    _.delay(updateTime, 50);
}

/**
 * @method compassEventHandler
 * @param  {Object} evt
 */
function compassEventHandler (evt) {
    // Handle error state when trying to get compass values
    if (evt.success !== undefined && !evt.success) {
        return;
    }

    // to prevent overloading only update the value every second
    _.throttle(function () {
        var matrix = Ti.UI.create2DMatrix();
        matrix = matrix.rotate(evt.heading.magneticHeading);
        var compassAnimation = Ti.UI.createAnimation({
            transform: matrix,
            duration: 800
        });
        $.compassNeedle.animate(a1);
    }, 1000);
}

/**
 * @method doClickStartGuide
 * Handle `click` on startSurvey button, create start survey controller
 */
function doClickStartSurvey () {
    require('flow').preSurvey();
}

/**
 * @method doClickStartGuide
 * Handle `click` on startGuide button, create guide controller
 */
function doClickStartGuide () {
    var guide = Alloy.createController('guide').getView();
    Alloy.Globals.navigationWindow.openWindow(guide, {animated: false});
    Alloy.Globals.menu.activateItem('menuItemGuide');
}
