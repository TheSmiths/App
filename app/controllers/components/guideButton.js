/**
 * Controller for the guide button componenent
 *
 * @class Controllers.components.guideButton
 */
var args = arguments[0] || {};

// Pass through all the properties set on the button, except for meta data and text
$.guideButtonContainer.applyProperties(_.omit(args, 'id', '__parentSymbol', '__itemTemplate', '$model'));

// Topics correlate to the data/guide content
var topics = {
    'windspeed': 0,
    'cloudCover': 0,
    'survey': 1,
    'material': 0,
    'category': 0,
    'dimension': 0,
    'distance': 0,
    'profile': 2
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
        $.guideButtonContainer.opacity = 0.6;
        setTimeout(function () { $.guideButtonContainer.opacity = 1; }, 350);
        Alloy.createController('guide/guideDetail', { dialog: true, guideIndex: topics[topic] });
    }, 100);

    buttonClick();
}
