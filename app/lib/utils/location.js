var log = require('utils/log');

var Location = module.exports = {
    coordinates: null,
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
            Location.requestCoordinates(callback);
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
    requestCoordinates: function requestCoordinates (callback, repeat) {
        // Geo listener: set preferences
        if(OS_IOS) {
            Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_BEST;
            Ti.Geolocation.distanceFilter = 10;
            Ti.Geolocation.getCurrentPosition(function(evt) {
                if (!evt.success || evt.error) {
                    log.error('[utils/location] Unable to determine location!');
                    Location.coordinates = null;
                    callback && callback(true);
                    return;
                }
                Location.coordinates = {
                    'longitude': evt.coords.longitude,
                    'latitude': evt.coords.latitude
                };
                callback && callback(null, Location.coordinates);
            });
            return;
        } else {
            // Don't register event multiple times
            if(Location.alreadyListening) {
                return;
            }
            Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_HIGH;
        }
        Ti.Geolocation.addEventListener('location', updateLocation);
        Location.alreadyListening = true;

        // log.info("[utils/location] register location event");
        function updateLocation(evt){
            if(evt.error){
                // If location doesn't work, we keep trying
                // log every half minute to avoid flooding
                _.throttle(function() {
                    log.error('[utils/location] Unable to determine location!');
                }, 30000, true);
            }else{
                // log.info("[utils/location] location event", evt);
                Location.coordinates = {
                    'longitude': evt.coords.longitude,
                    'latitude': evt.coords.latitude
                };
                // We've got what we need
                Ti.Geolocation.removeEventListener('location', updateLocation);
                Location.alreadyListening = false;

                // Repeat if necessary
                if(repeat) {
                    _.delay(Location.requestCoordinates, repeat);
                }
            }
        }
    }
};
