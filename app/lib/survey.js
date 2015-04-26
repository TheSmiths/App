
var log = require('utils/log');

var surveyTimer = module.exports = {
    startSurvey: function () {
        var startTime = new Date().getTime();
        var endTime = startTime + ( 60 * 60000 );
        var timeObject = { startTime: startTime, endTime: endTime };
        Ti.App.Properties.setObject('app-survey', timeObject);
        log.info('[lib/survey] StartSurvey at time', timeObject);
        return timeObject;
    },

    activeSurvey: function () {
        log.info('[lib/survey] Return activeSurvey', Ti.App.Properties.getObject('app-survey'));
        return Ti.App.Properties.getObject('app-survey');
    },

    stopSurvey: function () {
        Ti.App.Properties.removeProperty('app-survey');
    }
};
