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
/**
 * @method doButtonClick
 * Execute the buttonClick debounce function, trigger click and perform basic animation
 */
function doButtonClick () {
    var buttonClick = _.throttle(function buttonClick () {
        $.button.opacity = 0.6;
        _.delay(function () { $.button.opacity = 1; }, 150);
        $.trigger('click');
    }, 100);

    buttonClick();
}
