var log = require('utils/log');

var Location = module.exports = {
    coordinates: null,
    measurement: null,
    alreadyListening: false,

    /**
     * Get current location and returns it.
     * On android location should be fetched as early as possible.
     * @method getCurrentLatLng
     * @param  {Function} callback
     */
    getCurrentLatLng: function getCurrentLatLng (callback) {
        if (Ti.Geolocation.locationServicesEnabled) {
            // Both: request location in any case.
            // iOS: request with callback as it's fast enough.
            if (OS_IOS) {
                Location.requestCoordinates(callback);
            }

            if(OS_ANDROID) {
                // Android: location should be ready because we requested early.
                if (Location.coordinates) {
                    callback && callback(null, Location.coordinates);
                } else {
                    log.error('[utils/location] Please enable Geolocation!');
                    callback && callback(true);
                }
            }

        } else {
            log.error('[utils/location] Please enable Geolocation!');
            callback && callback(true);
        }
    },

    /**
     * Ask for location information and store if any.
     * Android can be really SLOW.
     * @method requestCoordinates
     * @param  {Function} callback for ios only
     * @param  {Integer} repeat for android only
     */
    requestCoordinates: function requestCoordinates (callback) {
        // Geo listener: set preferences
        if (OS_IOS) {
            Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_HIGH;
            Ti.Geolocation.distanceFilter = 25;
            Ti.Geolocation.getCurrentPosition(function(evt) {
                if (!evt.success || evt.error) {
                    log.error(evt.error);
                    alert('Unable to determine location!');

                    // Use previous coordinates if we have them
                    if (Location.coordinates) {
                        callback && callback(null, Location.coordinates);
                        return;
                    }
                    Location.coordinates = null;
                    callback && callback(true);
                    return;
                }

                Location.coordinates = {
                    'longitude': evt.coords.longitude,
                    'latitude': evt.coords.latitude
                };

                Location.measurement = new Date().getTime();

                callback && callback(null, Location.coordinates);
            });
            return;
        }
        // log.info("[utils/location] register location event");

    },
    trackLocation: function trackLocation () {
        if(Location.alreadyListening) {
            return;
        }
        log.info('[utils/location] Start tracking location!');
        Ti.Geolocation.addEventListener('location', updateLocation);
        Location.alreadyListening = true;
    },
    stopTracking: function stopTracking () {
        if(!Location.alreadyListening) {
            return;
        }
        Ti.Geolocation.removeEventListener('location', updateLocation);
        // Reset the locations and only update once there is a signal again.
        Location.alreadyListening = false;
    },
    getLocationsCoordinates: function getLocationCoordinates () {
        return Location.coordinates;
    },
    resetLocation: function resetLocation () {
        Location.coordinates = null;
    },
    checkLocation: function checkLocation () {
        var currentTime = new Date().getTime();
        var difference = currentTime - Location.measurement;
        difference = ( difference / 1000 ) / 60;

        if (difference > 30) {
            Location.resetLocation();
        }
    }
};

function updateLocation(evt){
    if(evt.error){
        // If location doesn't work, we keep trying
        // log every half minute to avoid flooding
        _.throttle(function() {
            log.error('[utils/location] Unable to determine location!');
        }, 30000, true);
        return;
    }

    log.info("[utils/location] location event", evt);

    if (evt.coords) {
        Location.coordinates = {
            'longitude': evt.coords.longitude,
            'latitude': evt.coords.latitude
        };

        Location.measurement = new Date().getTime();

        //Background service of iOS doesn't like the dispatcher, make sure Backbone is available
        require('dispatcher').trigger('trackingLocation');
    }
}

