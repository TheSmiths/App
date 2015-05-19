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
    initSurveyEvent: function (eventType, eventData) {
        if (activeEvent) {
            return log.info('[lib/event] Already tracking an event');
        }

        // Create activeEvent
        activeEvent = {
            type : eventType,
            data : eventData || {}
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
        log.info('[lib/event] Extended event data, new data object ', activeEvent.data);
    },
    /**
     * @method stopSurveyEvent
     * @param  {String} eventType Type of event [startSurvey, track, sighting, endSurvey]
     * @param  {Object]} eventData Data object containing the data
     */
    saveSurveyEvent: function (eventType, eventData) {
        if (activeEvent && activeEvent.type !== eventType) {
            return log.info('[lib/event] Unable to stop event if event has not started yet');
        }
        log.info('[lib/event] Saving ', eventType, eventData);
        // Allow instant save
        if (!activeEvent) {
            eventObject.initSurveyEvent(eventType);
        }
        // Update the survey data if needed
        if (eventData) {
            eventObject.updateSurveyEventData(eventType, eventData);
        }
        // Set timestamp
        activeEvent.data.eventTime = new Date().getTime();
        // Call save method
        eventObject.storeSurveyEvent(activeEvent.type, activeEvent.data);
        // Reset data for new event
        activeEvent = null;
    },
    /**
     * @method destroySurveyEvent
     *
     * @param  {[type]} eventType [description]
     * @return {[type]}           [description]
     */
    destroySurveyEvent: function (eventType) {
        activeEvent = null;
    },
    /**
     * @method saveSurveyEvent
     * @param  {String} eventType Type of event [startSurvey, track, sighting, endSurvey]
     * @param  {Object]} eventData Data object containing the data
     */
    storeSurveyEvent: function (eventType, eventData) {
        var activeSurveyObject = require('survey').activeSurvey();
        // Check if we have an active survey
        if (!activeSurveyObject) {
            return log.error('[lib/survey] No active survey, cannot store data');
        }

        var dataString = JSON.stringify(eventData);
        var eventModel = Alloy.createModel('Event', {
            type: eventType,
            survey_id: activeSurveyObject.surveyId,
            data: dataString
        });

        log.info('[lib/survey] Saving eventModel ', eventModel);

        eventModel.save();
    }
};
