/**
 * Controller for surveys comments
 *
 * @class Controllers.surveys.comment
 * @uses utils.log
 */
var log = require('utils/log');
var WM = require('windowManager');
var dispatcher = require('dispatcher');

// Internals
var type = "SURVEY";
var savedText = "";
var activated = false;
var comment;
var endTime;

_.extend($, {
    /**
     * @constructor
     * @method construct
     * @param {Object} config Controller configuration
     */
    construct: function(config) {
        if (config.sightingType) {
            type = config.sightingType;
        }

        if (type !== 'SURVEY') {
            $.headerSubTitle.text = 'Provide a description of the group of debris';
        } else {
            // Show fake survey option
            $.fakeSurvey.height = 40;
            $.fakeSurvey.bottom = 15;
            $.fakeSurvey.show();
        }

        WM.openWinWithBack($.getView(), {title: L('surveys.comment.title')});

        if (type !== 'SURVEY' && OS_IOS) {
            $.guideButton.topic = 'sightingRemarks';
        }
    },

    /**
     * @method destruct
     * function executed when closing window
     */
    destruct: function() {
    }
});

/**
 * @method onClickBackButton
 * Handle `click` on backButton
 */
function onClickBackButton () {
    WM.closeWin({ animated : true });
}


/**
 * @method doClickPostComment
 * Handle `click` on post comment button, storing the comment and final event.
 */
function doClickPostComment () {
    comment = $.commentTextArea.value.trim();

    if (type !== "SURVEY") {
        require('event').updateSurveyEventData('sighting', {comment: comment});
        require('flow').multiComment();
        return;
    }

    endTime = new Date().getTime();
    // Request location from system
    require('utils/location').getCurrentLatLng(function (error, locationObject) {
        if (error) {
            Alloy.createController('surveys/coordinates', { parent: $, state: 'POSTSURVEY' });
            dispatcher.on('survey:coordinates', finishSurvey);
            return;
        }

        finishSurvey(comment, endTime, locationObject);
    });
}

function finishSurvey (comment, endTime, locationObject) {
    dispatcher.off('survey:coordinates', finishSurvey);
    var dataObject = {};
    // Add time to object
    dataObject.comment = comment;
    dataObject.endTime = endTime;
    dataObject.endLocation = locationObject;
    // Track event
    require('event').saveSurveyEvent('finishSurvey', dataObject);
    // Update the flow
    require('flow').comment();
}

 /**
 * @method doClickfake
 * Handle `click` on fake button
 */
function doClickFakeSurvey () {
    $.fakeSwitch.value = !activated;

    if(!activated) {
        savedText = $.commentTextArea.value.trim();
        $.commentTextArea.editable = false;
        $.commentTextArea.setValue(L('surveys.comment.fakeComment'));
    } else {
        $.commentTextArea.editable = true;
        $.commentTextArea.value = savedText;
        savedText = "";
    }

    activated = !activated;
}
