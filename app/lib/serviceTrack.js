/**
 * Start tracking GPS coordinates
 *
 * - Create an interval every x minutes
 * - On interval get the current GPS location and store it as an event
 * - Stop the service once you are done
 */
Alloy = require('alloy');
_ = Alloy._

var events = require('event');
// Get data
var settings = Ti.App.Properties.getObject('app-survey-settings');
var currentSurvey = Ti.App.Properties.getObject('app-survey');
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
    var remainder = ( currentSurvey.endTime - new Date().getTime() ) / 1000;

    if (remainder <= 0) {
        Ti.API.info('[serviceTrack] Stop tracking gps in background');

        /* Stop the service */
        if (OS_IOS) {
            Ti.App.currentService.unregister();
        } else if (OS_ANDROID) {
            Ti.Android.currentService.stop();
        }

        Ti.Media.vibrate();
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

// Start Tracking
Ti.API.info('[serviceTrack] Tracking gps location in the background');
updateTime();
