/**
 * lib.survey
 */
var log = require('utils/log');



var surveyTimer = module.exports = {
    startSurvey: function () {
        var startTime = new Date().getTime();
        var endTime = startTime + ( 2 * 60000 );
        var uuid = require('uuid').create();
        var surveyObject = { surveyId: uuid.toString(), startTime: startTime, endTime: endTime };
        log.info('[lib/survey] UUID', uuid);
        // Save object
        Ti.App.Properties.setObject('app-survey', surveyObject);
        log.info('[lib/survey] StartSurvey at time', surveyObject);
        return surveyObject;
    },
    /**
     * @method activeSurvey
     * Return app-survey object from app properties
     * @return {Object} Active survey data object
     */
    activeSurvey: function () {
        log.info('[lib/survey] Return activeSurvey', Ti.App.Properties.getObject('app-survey'));
        return Ti.App.Properties.getObject('app-survey');
    },
    /**
     * @method stopSurvey
     * Stop survey by removing property
     */
    stopSurvey: function () {
        Ti.App.Properties.removeProperty('app-survey');
    }
};
