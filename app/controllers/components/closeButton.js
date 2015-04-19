/**
 * Controller for the close button componenent
 *
 * @class Controllers.components.closeButton
 */
var args = arguments[0];

// Pass through all the properties set on the button, except for meta data and text
$.closeButtonContainer.applyProperties(_.omit(args, 'id', '__parentSymbol', '__itemTemplate', '$model'));

function onClickCloseButton () {
    // @todo debounce / throttle
    $.trigger('click');
}

/**
 * [hide description]
 * @return {[type]} [description]
 */
function show () {
    $.closeButtonContainer.visible = true;
}

// Export fetchProfiles
exports.show = show;

