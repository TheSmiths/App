/**
 * Controller for the menu button componenent
 *
 * @class Controllers.components.menuButton
 */
var args = arguments[0];
var dispatcher = require('dispatcher');

// Pass through all the properties set on the button, except for meta data and text
$.menuContainer.applyProperties(_.omit(args, 'id', '__parentSymbol', '__itemTemplate', '$model'));

_.extend($, {
    /**
     * @constructor
     * @method construct
     * @param {Object} config Controller configuration
     */
    construct: function(config) {
        dispatcher.on('menuDidOpen', setCloseIcon);
        dispatcher.on('menuDidClose', setMenuIcon);
    },

    /**
     * @method destruct
     * function executed when closing window
     */
    destruct: function() {
        dispatcher.off('menuDidOpen', setCloseIcon);
        dispatcher.off('menuDidClose', setMenuIcon);
    }
});

/**
 * @method doClickMenu
 * Handle click on menu button
 * @params {Object} evt
 * @return {Trigger} `Click`
 */
function doClickMenu (evt) {
    var buttonClick = _.throttle(function buttonClick () {
        $.menuIcon.opacity = 0.6;
        setTimeout(function () { $.menuIcon.opacity = 1; }, 350);
        dispatcher.trigger('drawer:open');
        $.trigger('click');
    }, 100);

    buttonClick();
}

/**
 * [setCloseIcon description]
 * @param {[type]} evt [description]
 */
function setCloseIcon (evt) {
    $.menuIcon.image = '/images/navigation/menuIconClose.png';
    $.menuIcon.width = 15;
    $.menuIcon.height = 15;
}

/**
 * [setMenuIcon description]
 * @param {[type]} evt [description]
 */
function setMenuIcon (evt) {
    $.menuIcon.image = '/images/navigation/menuIcon.png';
    $.menuIcon.width = 19;
    $.menuIcon.height = 12;
}

/**
 * [hide description]
 * @return {[type]} [description]
 */
function hide () {
    $.menuContainer.visible = false;
}

// Export fetchProfiles
exports.hide = hide;
