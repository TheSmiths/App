/**
 * Controller for the back button componenent
 *
 * @class Controllers.components.backbutton
 *
 * ios Only
 */

/**
 * @method onClickBackButton
 * Handle `click` on back button
 * Execute the buttonClick debounce function, trigger click and perform basic fadeout animation
 */
function onClickBackButton () {
    var buttonClick = _.throttle(function buttonClick () {
        $.backButtonContainer.opacity = 0.6;
        _.delay(function () { $.backButtonContainer.opacity = 1; }, 300);
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
    $.backButtonContainer.visible = true;
};


/**
 * @method hide
 * @public
 * Allow dynamic visibilty change on runtime
 */
exports.hide = function () {
    $.backButtonContainer.visible = false;
};
