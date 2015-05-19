/**
 * lib.flow
 *
 */
var log = require('utils/log');

var events = require('event');
var survey = require('survey');
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
                    Alloy.createController('profiles/newProfile', { flow: 'PRESURVEY'} );
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
        Alloy.createController('surveys/windspeed', { flow: 'PRESURVEY'} );
    },
    /**
     * @method saveStartSurveyWindSpeed
     * @param {String} state State of the flow either PRESURVEY or POSTSURVEY
     * @param {Object} windspeed Windspeed category as int
     */
    saveWindspeed: function (state, windspeed) {
        var eventType = 'startSurvey';
        if (state === 'POSTSURVEY') {
            eventType = 'finishSurvey';
        }
        events.updateSurveyEventData(eventType, windspeed);
        Alloy.createController('surveys/cloudCover', { flow: state} );
    },
    /**
     * @method saveCloudCover
     * @param {String} state State of the flow either PRESURVEY or POSTSURVEY
     * @param {Object} cloudCover cloudCover category as int
     */
    saveCloudCover: function (state, cloudCover) {
        var eventType = 'startSurvey';
        if (state === 'POSTSURVEY') {
            eventType = 'finishSurvey';
        }
        events.updateSurveyEventData(eventType, cloudCover);

        if (state !== 'POSTSURVEY') {
            return Alloy.createController('surveys/survey');
        }

        Alloy.createController('surveys/comment');
    },
    /**
     * @method sighting
     * Start tracking sighting, save current time and location in event data before initialiting flow
     */
    sighting: function () {
        Alloy.createController('sighting/material');
    },
    /**
     * @method material
     * Flow after finishing material
     * @param {Int} material Material category (to determine the debris type)
     */
    material: function (material) {
        Alloy.createController('sighting/category', {material: material});
    },
    /**
     * @method category
     * Flow after finishing category
     */
    category: function () {
        Alloy.createController('sighting/dimension');
    },
    /**
     * @method dimension
     * Flow after finishing dimension
     */
    dimension: function () {
        Alloy.createController('sighting/distance');
    },
    /**
     * @method distance
     * Flow after finishing distance
     */
    distance: function () {
        require('windowManager').closeWin({animated: true});
    },
    /**
     * [postSurvey description]
     * @return {[type]} [description]
     */
    postSurvey: function (startedFromRootBoolean) {
        startedFromRoot = startedFromRootBoolean;
        Alloy.createController('surveys/windspeed', { flow: 'POSTSURVEY' });
    },
    /**
     * [comment description]
     * @return {[type]} [description]
     */
    comment: function () {
        require('survey').destroySurvey();
        Alloy.createController('surveys/done');
    },

    done: function () {
        require('windowManager').closeWin({animated: true});

        if (startedFromRoot) {
            Alloy.createController('index');
        }
    }
};


