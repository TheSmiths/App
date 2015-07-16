/**
 * Start tracking GPS coordinates
 *
 * - Create an interval every x minutes
 * - On interval get the current GPS location and store it as an event
 * - Stop the service once you are done
 */
Alloy = require('alloy');
_ = Alloy._;

var events = require('event');
// Get data
var settings = Ti.App.Properties.getObject('app-survey-settings');
var currentSurvey = Ti.App.Properties.getObject('app-survey');
var vibrations = 20;

// Set interval data
var TRACKLOCATIONTIME = Ti.App.Properties.getString('app-survey-trackLocationTime');
var TRACKTIMEINTERVAL = settings ? settings.trackingInterval * 60 : Alloy.CFG.intervalDuration * 60;

/**
 * @method updateTime
 * Get the remainder of the survey
 * @return {[type]} [description]
 */
function updateTime() {
    Ti.API.info('[serviceTrack] Check remaining time and track if needed.');
    // If our survey stopped
    if (!currentSurvey) {
        return;
    }

    var remainder = ( currentSurvey.endTime - new Date().getTime() ) / 1000;

    if (remainder <= 0 && remainder > -10) {
        Ti.API.info('[serviceTrack] Stop tracking gps in background');

        // Save one more time, so we have the last location data available
        require('utils/location').getCurrentLatLng(function (err, locationData) {
            events.saveSurveyTrackEvent({location: locationData});
        });

        Ti.API.info('[serviceTrack] Vibrate phone');

        if (OS_IOS) {
            vibratePhone();
        }

        if (OS_ANDROID) {
            require('dispatcher').trigger('vibrate');
            Ti.API.info('[serviceTrack] Stop service');

            try {
                Ti.Android.currentService.stop();
            } catch (e) {
                Ti.API.info('[serviceTrack] Failed to stop service');
            }
        }

        return;
    }

    if (remainder < TRACKLOCATIONTIME && TRACKLOCATIONTIME > 0) {
        require('utils/location').getCurrentLatLng(function (err, locationData) {
            events.saveSurveyTrackEvent({location: locationData});
            // Let the survey view know there is an update
        });

        TRACKLOCATIONTIME = TRACKLOCATIONTIME - TRACKTIMEINTERVAL;
        // // Update value for background Service.
        Ti.App.Properties.setString('app-survey-trackLocationTime', TRACKLOCATIONTIME);
    }

    if (OS_IOS) {
        setTimeout(function () { updateTime(); }, 600);
    }
}

function vibratePhone () {
    if (vibrations > 0) {
        Ti.Media.vibrate();
        vibrations = vibrations - 1;
        _.delay(function () {
            vibratePhone();
        }, 2000);
        return;
    }

    /* Stop the service */
    if (OS_IOS) {
        Ti.App.currentService.unregister();
    }
}

if (!currentSurvey && OS_IOS) {
    Ti.App.currentService.stop();
    Ti.App.currentService.unregister();
}

// Start Tracking
Ti.API.info('[serviceTrack] Tracking gps location in the background');
updateTime();
