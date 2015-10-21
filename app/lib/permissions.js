var permissions = module.exports = {
    init: function () {
        // Reset badge once opening the app to remove local notifications
        if (!Ti.Geolocation.locationServicesEnabled) {
            log.error('[surveys] Please enable location services');
            alert('Please make sure you turned on your GPS before starting the survey.');
        }

        if (OS_IOS) {
            Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_HIGH;
            Ti.Geolocation.distanceFilter = 50;
        }

        if (OS_ANDROID) {
            Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_HIGH;
        }

        require('utils/location').trackLocation();

        if (Ti.Platform.name == "iPhone OS" && parseInt(Ti.Platform.version.split(".")[0]) >= 8) {
            Ti.App.iOS.registerUserNotificationSettings({
                types: [
                    Ti.App.iOS.USER_NOTIFICATION_TYPE_ALERT,
                    Ti.App.iOS.USER_NOTIFICATION_TYPE_SOUND,
                    Ti.App.iOS.USER_NOTIFICATION_TYPE_BADGE
                ]
            });
        }
    }
};
