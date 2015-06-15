/**
 * Controller for the menu
 *
 * @class Controllers.menu
 * @uses utils.log
 * @uses module.statusbar
 */
var log = require('utils/log');


// Internal variables
var activeItem;

_.extend($, {
    /**
     * @constructor
     * @method construct
     * @param {Object} config Controller configuration
     */
    construct: function(config) {
        // Set surveys to active by default
        $.versionLabel.text = L('menu.version') +  Ti.App.version;
        activeItem = 'menuItemSurveys';
        activateItem('menuItemSurveys');
    },

    /**
     * @method destruct
     * function executed when closing window
     */
    destruct: function() {
    }
});

/**
 * @method onClickSurveys
 * Handle `click` on surveys menu item, open surveys (if not active), close menu
 * @param  {Object} evt Event object
 */
function onClickSurveys (evt) {
    if (activeItem !== 'menuItemSurveys') {
        navigateTo(Alloy.createController('surveys'));
        activateItem('menuItemSurveys');
    }
}

/**
 * @method onClickProfiles
 * Handle `click` on profiles menu item, open profiles (if not active), close menu
 * @param  {Object} evt Event object
 */
function onClickProfiles (evt) {
    if (activeItem !== 'menuItemProfiles') {
        navigateTo(Alloy.createController('profiles', { flow: 'NONE' }));
        activateItem('menuItemProfiles');
    }
}

/**
 * @method onClickGuide
 * Handle `click` on guide menu item, open guide (if not active), close menu
 * @param  {Object} evt Event object
 */
function onClickGuide (evt) {
    if (activeItem !== 'menuItemGuide') {
        navigateTo(Alloy.createController('guide'));
        activateItem('menuItemGuide');
    }
}

/**
 * @method onClickSettings
 * Handle `click` on settings menu item, open settings (if not active), close menu
 * @param  {Object} evt Event object
 */
function onClickSettings (evt) {
    if (activeItem !== 'menuItemSettings') {
        navigateTo(Alloy.createController('settings'));
        activateItem('menuItemSettings');
    }
}

/**
 * @method onClickMore
 * Handle `click` on more menu item, open more (if not active), close menu
 * @param  {Object} evt Event object
 */
function onClickMore (evt) {
    if (activeItem !== 'menuItemMore') {
        navigateTo(Alloy.createController('more'));
        activateItem('menuItemMore');
    }
}

/**
 * @method activeItem
 * Return previous active item to normal, activate new menu item
 * @param  {String} menuItem Item to activate
 */
function activateItem (menuItem) {
    $[activeItem].backgroundColor = 'transparent';
    $[menuItem].backgroundColor = '#00B4C7';
    activeItem = menuItem;
}

/**
 * Open given controller in a new window (platform specific)
 * @method navigateTo
 * @param  {Controller} controller navigation target
 */
function navigateTo(controller) {
    if(OS_IOS) {
        Alloy.Globals.navigationWindow.openWindow(controller.getView(), {animated: false});
        Alloy.Globals.drawer.hideMenuViewController();
        return;
    }
    /* ANDROID */
    require('windowManager').openWinWithBack(controller.getView());
}

// Exports
exports.activateItem = activateItem;
