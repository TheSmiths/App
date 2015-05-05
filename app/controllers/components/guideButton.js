/**
 * Controller for the guide button componenent
 *
 * @class Controllers.components.menuButton
 */
var args = arguments[0] || {};

// Pass through all the properties set on the button, except for meta data and text
$.guideButtonContainer.applyProperties(_.omit(args, 'id', '__parentSymbol', '__itemTemplate', '$model'));

var topics = {
    'windspeed': 0,
    'cloudCover': 0,
    'survey': 0,
    'material': 0,
    'category': 0,
    'dimension': 0,
    'distance': 0,
    'color': 0
};


/**
 * @method onClickGuideButton
 * @param  {Object} evt
 */
function onClickGuideButton (evt) {
    var topic = args.topic;
    console.log('(****(*(&', topic);
    if (!topic) {
        return;
    }

    Alloy.createController('guide/guideDetail', { dialog: true, guideIndex: topics[topic] });
}
