/**
 * lib.event
 */
var log = require('utils/log');

var activeEvent;

var eventObject = module.exports = {
    /**
     * @method startSurveyEvent
     * @param  {String} eventType Type of event [startSurvey, track, sighting, endSurvey]
     * @param  {Object]} eventData Data object containing the data
     */
    startSurveyEvent: function (eventType, eventData) {
        if (activeEvent) {
            return log.info('[lib/event] Already tracking an event');
        }

        // Create activeEvent
        activeEvent = {
            'type' : eventType,
            'data' : eventData
        };
    },
    /**
     * @method updateSurveyEventData
     * @param  {String} eventType Type of event [startSurvey, track, sighting, endSurvey]
     * @param  {Object]} eventData Data object containing the data
     */
    updateSurveyEventData: function (eventType, eventData) {
        if (activeEvent.type !== eventType) {
            return log.info('[lib/event] Unable to update event if event has not started yet');
        }
        // Extend the data
        activeEvent.data = _.extend(activeEvent.data, eventData);
    },
    /**
     * @method stopSurveyEvent
     * @param  {String} eventType Type of event [startSurvey, track, sighting, endSurvey]
     * @param  {Object]} eventData Data object containing the data
     */
    stopSurveyEvent: function (eventType, eventData) {
        if (activeEvent.type !== eventType) {
            return log.info('[lib/event] Unable to stop event if event has not started yet');
        }
        // Update the survey data if needed
        if (eventData) {
            eventObject.updateSurveyEventData(eventType, eventData);
        }
        saveSurveyEvent(activeEvent.type, activeEvent.data);
        // Reset data for new event
        activeEvent = null;
    },
    /**
     * @method saveSurveyEvent
     * @param  {String} eventType Type of event [startSurvey, track, sighting, endSurvey]
     * @param  {Object]} eventData Data object containing the data
     */
    saveSurveyEvent: function (eventType, eventData) {
        var activeSurveyObject = require('survey').activeSurvey();
        // Check if we have an active survey
        if (!activeSurveyObject) {
            return log.error('[lib/survey] No active survey, cannot store data');
        }

        var dataString = JSON.stringify(eventData);
        var eventModel = Alloy.createModel('Event', {
            type: eventType,
            survey_id: activeSurveyObject.id,
            data: dataString
        });

        log.info('[lib/survey] Saving eventModel ', eventData);

        eventModel.save();
    }
};
