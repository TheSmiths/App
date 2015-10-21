/**
 * lib.flow
 *
 */
var log = require('utils/log');
var events = require('event');
var libSurvey = require('surveyManager');
var dispatcher = require('dispatcher');
var WM = require('windowManager');
var libLocation = require('utils/location');

// Internals
var lockedFlow = false;

var flowLibrary = module.exports = {
    /**
     * @method startSurvey
     * @public
     * Handle startSurvey flow
     */
    preSurvey: function () {
        if (lockedFlow) { return; }
        lockFlow();

        // On Android, start looking for a location (can be slow)
        // We'll make sure to update location after 2 min
        // Edit: ios is slow too.

        libLocation.checkLocation();

        if (OS_ANDROID) {
            libLocation.requestCoordinates(null, 120000);
        }

        // Start storing the event
        events.initSurveyEvent('startSurvey');
        // Check if there are profiles in order to determine which view to open
        Alloy.createCollection('Profile').fetch({
            success: function(collection, response, options) {
                if (collection.length === 0) {
                    Alloy.createController('profiles/profileDetails', { flow: 'PRESURVEY'} );
                    return;
                }

                Alloy.createController('profiles', { flow: 'PRESURVEY'} );
            }
        });
    },
    /**
     * @method saveStartSurveyProfile
     * @param  {Object} userData Data object containing `observerName` and `platformHeight`
     */
    saveProfile: function (userData) {
        if (lockedFlow) { return; }
        lockFlow();

        events.updateSurveyEventData('startSurvey', userData);
        libSurvey.setUser(userData);
        Alloy.createController('surveys/windSpeed');
    },
    /**
     * @method saveStartSurveyWindSpeed
     * @param {String} state State of the flow either PRESURVEY or POSTSURVEY
     * @param {Object} windspeed Windspeed category as int
     */
    saveWindspeed: function (windspeed) {
        if (lockedFlow) { return; }
        lockFlow();

        events.updateSurveyEventData('startSurvey', windspeed);
        Alloy.createController('surveys/cloudCover');
    },
    /**
     * @method saveCloudCover
     * @param {String} state State of the flow either PRESURVEY or POSTSURVEY
     * @param {Object} cloudCover cloudCover category as int
     */
    saveCloudCover: function (cloudCover) {
        if (lockedFlow) { return; }
        lockFlow();

        events.updateSurveyEventData('startSurvey', cloudCover);
        Alloy.createController('surveys/survey');
    },
    /**
     * @method sighting
     * Start tracking sighting, save current time and location in event data before initialiting flow
     */
    sighting: function () {
        if (lockedFlow) { return; }
        lockFlow();

        Alloy.createController('sighting/sightingType');
    },
    /**
     * @method sightingType
     * Continue after sighting type
     */
    sightingType: function (sightingType) {
        if (lockedFlow) { return; }
        lockFlow();

        Alloy.createController('sighting/material', {sightingType: sightingType});
    },
    /**
     * @method material
     * Flow after finishing material
     * @param {Int} material Material category (to determine the debris type)
     */
    material: function (material, sightingType) {
        if (sightingType === "SINGLE") {
            if (lockedFlow) { return; }
            lockFlow();

            return Alloy.createController('sighting/category', {material: material, sightingType: sightingType});
        }

        flowLibrary.category(sightingType);
    },
    /**
     * @method category
     * Flow after finishing category
     */
    category: function (sightingType, ignoreLocked) {
        if (!ignoreLocked) {
            if (lockedFlow) { return; }
            lockFlow();
        }

        Alloy.createController('sighting/dimension', {sightingType: sightingType});
    },
    /**
     * @method dimension
     * Flow after finishing dimension
     */
    dimension: function (sightingType) {
        if (lockedFlow) { return; }
        lockFlow();

        Alloy.createController('sighting/distance', {sightingType: sightingType});
    },
    /**
     * @method distance
     * Flow after finishing distance
     */
    distance: function (sightingType) {
        if (lockedFlow) { return; }
        lockFlow();

        if (sightingType === "SINGLE") {
            return saveSighting(function () {
                return WM.closeNav({animated: true});
            });
        }

        Alloy.createController('surveys/comment', {sightingType: "MULTI"});
    },
    /**
     * @method multiComment
     * Comment after doing multi flow
     */
    multiComment: function () {
        if (lockedFlow) { return; }
        lockFlow();

        saveSighting(function () {
            WM.closeNav({animated: true});
        });
    },
    /**
     * @method postSurvey
     */
    postSurvey: function () {
        if (lockedFlow) { return; }
        lockFlow();
        Alloy.createController('surveys/comment');
    },
    /**
     * @method comment
     */
    comment: function () {
        if (lockedFlow) { return; }
        lockFlow();

        Alloy.createController('surveys/done');
    },

    /**
     * @method done
     *
     * @return {Function} [description]
     */
    done: function () {
        if (lockedFlow) { return; }
        lockFlow();

        WM.closeNav({animated: true});
    }
};

/**
 * @method saveSighting
 * Save sighting method
 * @param  {Function} callback
 * @todo Might need a better location (different lib)
 */
function saveSighting (callback) {
    // Get current time
    var sightingEndTime = new Date().getTime();
    // Request location from system
    libLocation.getCurrentLatLng(function (error, locationObject) {
        var dataObject = {};
        // Add time to object
        dataObject.endTime = sightingEndTime;
        dataObject.endLocation = locationObject;
        // Track event
        require('event').saveSurveyEvent('sighting', dataObject);
        // Update the flow
        dispatcher.trigger('surveyUpdate');
        // Continue flow
        callback();
    });
}

/**
 * method lockFlow
 * Disallow the flow, prevent opening to many windows, release after x time.
 */
function lockFlow () {
    lockedFlow = true;

    _.delay(function () {
        lockedFlow = false;
    }, 300);
}
