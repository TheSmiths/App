/**
 * lib.upload
 */

var async = require('vendor/async');
var log = require('utils/log');
var surveyCollection = Alloy.createCollection('Survey');
var eventCollection = Alloy.createCollection('Event');

// Internals
var uploadArray = [];

module.exports = function () {
    // Check if user is online
    // Retreive all surveys wich have not been uploaded
    // For each survey get all the events
    // Combine all into a single object
    // Print object for serverExample
    // Send object through http request

    if (!Titanium.Network.online) {
        alert(L('upload.noInternet'));
    }

    // Reset Array
    uploadArray = [];

    async.waterfall([
        fetchSurveys,
        fetchEventsPerSurvey
    ], function (err, result) {
        if (err) {
            if (err === "NOSURVEYS") {
                alert(L('upload.noUploadableSurveys'));
            }
            return;
        }

        _.each(uploadArray, function (survey) {
            var surveyModel = surveyCollection.get(survey.surveyId);
            surveyModel.set('uploaded',true);
            surveyModel.save();
        });

        Ti.App.fireEvent('newSurvey');
        alert(L('upload.uploadedSurveys'));
    });
};

/**
 * @method fetchSurveys
 * @param  {Function} callback
 */
function fetchSurveys (callback) {
    surveyCollection.fetch({
        query: 'SELECT * from surveys where uploaded = "0"',
        success: function(collection, response, options) {
            if (collection.length === 0) {
                return callback('NOSURVEYS');
            }
            callback();
        },
        error: function(collection, response, options) {
            log.info('[upload] Unable to retreive the survey', response);
            callback(response);
        }
    });
}

/**
 * @method fetchEventsPerSurvey
 * @param  {Function} callback
 */
function fetchEventsPerSurvey (callback) {
    surveyCollection.each(function (model) {
        var surveyId = model.get('survey_id');
        var surveyObject = {
            surveyId: surveyId,
            observer: model.get('observer_id'),
            created: new Date(Math.floor(model.get('created'))),
            events: []
        };

        eventCollection.fetch({
            query: 'SELECT * from events where survey_id = "' + surveyId + '"',
            success: function(collection, response, options) {
                log.info('[upload] collection, response', collection, response);
                eventCollection.each(function (model) {
                    var eventObject = {
                        type: model.get('type'),
                        data: JSON.parse(model.get('data'))
                    };
                    surveyObject.events.push(eventObject);
                });
            },
            error: function(collection, response, options) {
                log.info('[upload] collection, response', response);
                callback(response);
            }
        });
        uploadArray.push(surveyObject);
        eventCollection.reset();
    });

    callback();
}
