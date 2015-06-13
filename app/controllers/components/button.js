/**
 * Controller for the button componenent
 *
 * @class Controllers.components.button
 */
var args = arguments[0];

// Pass through all the properties set on the button, except for meta data and text
$.button.applyProperties(_.omit(args, 'id', '__parentSymbol', '__itemTemplate', '$model', 'text'));

// Apply the text to the label
if (args.text) {
    $.buttonLabel.text = args.text;
}

// Apply the text to the label
if (args.textAlign) {
    $.buttonLabel.textAlign = args.textAlign;
}

// Apply the color to the label
if (args.color) {
    $.buttonLabel.color = args.color;
}

// Apply the color to the label
if (args.font) {
    $.buttonLabel.font = args.font;
}
/**
 * @method doButtonClick
 * Execute the buttonClick debounce function, trigger click and perform basic fadeout animation
 */
function doButtonClick () {
    var buttonClick = _.throttle(function buttonClick () {
        $.button.opacity = 0.6;
        _.delay(function () { $.button.opacity = 1; }, 300);
        $.trigger('click');
    }, 200);

    buttonClick();
}

/**
 * @method setText
 * @public
 * Allow dynamic text change on runtime
 * @param {String} buttonText
 */
exports.setText = function (buttonText) {
    $.buttonLabel.text = buttonText;
};

/**
 * @method setVisible
 * @public
 * Allow dynamic visibilty change on runtime
 * @param {Boolean} visible Show or hide a button
 */
exports.setVisible = function (visible) {
    $.button.visible = visible;
};

