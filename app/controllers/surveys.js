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
 * [populateWindow description]
 * @return {[type]} [description]
 */
function populateWindow () {
    if (!Ti.Geolocation.locationServicesEnabled) {

    }

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
 * [updateTime description]
 * @return {[type]} [description]
 */
function updateTime () {
    $.headerCurrentTime.text = date.getCurrentTime();
    _.delay(updateTime, 50);
}

/**
 * [compassHandler description]
 * @param  {[type]} evt [description]
 * @return {[type]}     [description]
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
 * @method doClickStartSurvey
 */
function doClickStartSurvey () {
    Alloy.createCollection('Profile').fetch({
        success: function(collection, response, options) {
            if (collection.length === 0) {
                Alloy.createController('profiles/newProfile', { flow: 'SURVEY'} );
                return;
            }

            Alloy.createController('profiles', { flow: 'SURVEY'} );

        }
    });
}

/**
 * @method doClickStartGuide
 * Handle `click` on #StartGuide button, create guide controller
 * @return {[type]} [description]
 */
function doClickStartGuide () {
    var guide = Alloy.createController('guide').getView();
    Alloy.Globals.navigationWindow.openWindow(guide, {animated: false});
    Alloy.Globals.menu.activateItem('menuItemGuide');
}

/**
 * Testing drawer menu
 */
function doClickCompass () {
    Alloy.Globals.drawer.toggleRightWindow();
}





