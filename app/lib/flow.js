/**
 * lib.flow
 *
 */
var log = require('utils/log');
var events = require('event');
var survey = require('survey');
var dispatcher = require('dispatcher');

// Internals
var startedFromRoot = false;

var flowLibrary = module.exports = {
    /**
     * @method startSurvey
     * @public
     * Handle startSurvey flow
     */
    preSurvey: function () {
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
        events.updateSurveyEventData('startSurvey', userData);
        survey.setUser(userData);
        Alloy.createController('surveys/windspeed');
    },
    /**
     * @method saveStartSurveyWindSpeed
     * @param {String} state State of the flow either PRESURVEY or POSTSURVEY
     * @param {Object} windspeed Windspeed category as int
     */
    saveWindspeed: function (state, windspeed) {
        events.updateSurveyEventData('startSurvey', windspeed);
        Alloy.createController('surveys/cloudCover', { flow: state} );
    },
    /**
     * @method saveCloudCover
     * @param {String} state State of the flow either PRESURVEY or POSTSURVEY
     * @param {Object} cloudCover cloudCover category as int
     */
    saveCloudCover: function (state, cloudCover) {
        events.updateSurveyEventData('startSurvey', cloudCover);
        Alloy.createController('surveys/survey');
    },
    /**
     * @method sighting
     * Start tracking sighting, save current time and location in event data before initialiting flow
     */
    sighting: function () {
        Alloy.createController('sighting/sightingType');
    },
    /**
     * @method sightingType
     * Continue after sighting type
     */
    sightingType: function (sightingType) {
        Alloy.createController('sighting/material', {sightingType: sightingType});
    },
    /**
     * @method material
     * Flow after finishing material
     * @param {Int} material Material category (to determine the debris type)
     */
    material: function (material, sightingType) {
        if (sightingType === "SINGLE") {
            return Alloy.createController('sighting/category', {material: material, sightingType: sightingType});
        }

        flowLibrary.dimension(sightingType);
    },
    /**
     * @method category
     * Flow after finishing category
     */
    category: function (sightingType) {
        Alloy.createController('sighting/dimension', {sightingType: sightingType});
    },
    /**
     * @method dimension
     * Flow after finishing dimension
     */
    dimension: function (sightingType) {
        Alloy.createController('sighting/distance', {sightingType: sightingType});
    },
    /**
     * @method distance
     * Flow after finishing distance
     */
    distance: function (sightingType) {
        if (sightingType === "SINGLE") {
            return saveSighting(function () {
                return require('windowManager').closeWin({animated: true});
            });
        }

        Alloy.createController('surveys/comment', {sightingType: "MULTI"});
    },
    /**
     * @method multiComment
     * Comment after doing multi flow
     */
    multiComment: function () {
        saveSighting(function () {
            require('windowManager').closeWin({animated: true});
        });
    },
    /**
     * [postSurvey description]
     * @return {[type]} [description]
     */
    postSurvey: function (startedFromRootBoolean) {
        startedFromRoot = startedFromRootBoolean;
        Alloy.createController('surveys/comment');
    },
    /**
     * [comment description]
     * @return {[type]} [description]
     */
    comment: function () {
        require('survey').destroySurvey();
        Alloy.createController('surveys/done');
    },

    /**
     * @method done
     *
     * @return {Function} [description]
     */
    done: function () {
        require('windowManager').closeWin({animated: true});

        if (startedFromRoot) {
            Alloy.createController('index');
        }
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
    require('utils/location').getCurrentLatLng(function (error, locationObject) {
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


