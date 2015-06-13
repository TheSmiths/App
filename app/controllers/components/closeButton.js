/**
 * Controller for the close button componenent
 *
 * @class Controllers.components.closeButton
 */
var args = arguments[0];

// Pass through all the properties set on the button, except for meta data and text
$.closeButtonContainer.applyProperties(_.omit(args, 'id', '__parentSymbol', '__itemTemplate', '$model'));

function onClickCloseButton () {
    var buttonClick = _.throttle(function buttonClick () {
        $.button.opacity = 0.6;
        _.delay(function () { $.closeButtonContainer.opacity = 1; }, 300);
        $.trigger('click');
    }, 200);

    buttonClick();
}

/**
 * @method show
 * @public
 * Allow dynamic visibilty change on runtime
 */
exports.show = function () {
    $.closeButtonContainer.visible = true;
}

