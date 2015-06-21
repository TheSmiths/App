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
    'windspeed': 1,
    'cloudCover': 1,
    'survey': 1,
    'material': 2,
    'category': 2,
    'dimension': 2,
    'distance': 2,
    'profile': 4
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
