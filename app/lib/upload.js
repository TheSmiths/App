/**
 * lib.upload
 */

// Libraries
var async = require('vendor/async');
var log = require('utils/log');
var notifications = require('notifications');

// Collections
var surveyCollection = Alloy.createCollection('Survey');
var eventCollection = Alloy.createCollection('Event');

// Configuration
var config = require('config');

// Internals
var uploadArray = [];

module.exports = function (callback) {
    // Check if user is online
    // Retreive all surveys wich have not been uploaded
    // For each survey get all the events
    // Combine all into a single object
    // Print object for serverExample
    // Send object through http request

    if (!Titanium.Network.online) {
        callback('NOINTERNET');
    }

    // Reset Array
    uploadArray = [];

    // Fetch data required to send survey
    async.waterfall([
        fetchSurveys,
        fetchEventsPerSurvey
    ], function (err, result) {
        if (err) {
            if (err === "NOSURVEYS") {
                // propangate error?
                alert(L('upload.noUploadableSurveys'));
            }
            return;
        }

        // Move url into configuration
        var url = "http://178.62.203.94:3000";


        //client.setRequestHeader("Content-Type", "application/json; charset=utf-8");

        async.each(uploadArray, function (survey, callback) {
            var client = Ti.Network.createHTTPClient({
                 // function called when the response data is available
                onload : function(e) {
                    log.info('[upload] Successfully uploaded survey');
                    // Get the upload
                    var surveyModel = surveyCollection.get(survey.surveyId);
                    surveyModel.set('uploaded', true);
                    surveyModel.save();
                    // Decrease the nr of notifications
                    notifications.decrease(1);
                    callback();
                },
                // function called when an error occurs, including a timeout
                onerror : function(e) {
                    // Check for error code to return appropriate error
                    log.info('[upload] Failed to upload survey');
                        callback(e.error);
                    },
                timeout : 50000
            });
            // Up up and away
            // Prepare the connection.
            client.open("PUT", config.surveyUploadUrl);
            client.setRequestHeader("Content-Type", "text/plain");
            // Send the request
            client.send(JSON.stringify(survey));
            // Only upload code once sucessfull

        }, function (err) {
            if( err ) {
                callback(err);
            }

            callback();
        });
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
 * For each of the surveys in the collection fetch all events
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
        // Survey is "constructed" push to the uploadArray
        uploadArray.push(surveyObject);
        // Cleanup
        eventCollection.reset();
    });

    callback();
}
