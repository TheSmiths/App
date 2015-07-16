/**
 * Controller for the guide button componenent
 *
 * @class Controllers.components.guideButton
 */
var args = arguments[0] || {};

// Pass through all the properties set on the button, except for meta data and text
if (OS_IOS) {
    $.guideButtonContainer.applyProperties(_.omit(args, 'id', '__parentSymbol', '__itemTemplate', '$model'));
}

// Topics correlate to the data/guide content
var topics = {
    'preparing': 1,
    'gps': 2,
    'profile': 3,
    'windspeed': 8,
    'cloudCover': 9,
    'survey': 5,
    'amount': 10,
    'material': 11,
    'category': 12,
    'dimension': 13,
    'distance': 14,
    'sightingRemarks': 15,
    'surveyRemarks': 16
};

/**
 * @method onClickGuideButton
 * @param  {Object} evt
 */
function onClickGuideButton (evt) {
    var topic = args.topic;

    if (!topic) {
        return;
    }

    var buttonClick = _.throttle(function buttonClick () {
        if (OS_IOS) {
            $.guideButtonContainer.opacity = 0.6;
            setTimeout(function () { $.guideButtonContainer.opacity = 1; }, 350);
        }
        Alloy.createController('guide/guideDetail', { dialog: true, guideIndex: topics[topic] });
    }, 100);

    buttonClick();
}

/**
 * @method setTopic
 * Set topic
 */
exports.setTopic = function (topic) {
    args.topic = topic;
};
