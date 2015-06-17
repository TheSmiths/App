var log = require('utils/log');

module.exports = {
    getCurrentLatLng: function getCurrentLatLng (callback) {
        if (Ti.Geolocation.locationServicesEnabled) {
            
            if (OS_IOS) {
                Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_BEST;
                Ti.Geolocation.distanceFilter = 10;
            } else if (OS_ANDROID) {
                Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_HIGH;
            }

            Ti.Geolocation.getCurrentPosition(function(evt) {
                if (!evt.success || evt.error) {
                    log.error('[utils/location] Unable to determine location!');
                    callback && callback(true);
                    return;
                }

                callback && callback(null, {
                    'longitude': evt.coords.longitude,
                    'latitude': evt.coords.latitude
                });
            });
        } else {
            log.error('[utils/location] Please enable Geolocation!');
        }
    }
};
