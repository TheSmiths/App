/**
 * Controller for the menu
 *
 * @class Controllers.menu
 * @uses utils.log
 * @uses module.statusbar
 */
var log = require('utils/log');
var dispatcher = require('dispatcher');

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
        dispatcher.on("menu:activate", function(name) {
            activateItem(name);
        });
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
        dispatcher.trigger("index:navigate", 'surveys');
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
        dispatcher.trigger("index:navigate", 'profiles');
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
        dispatcher.trigger("index:navigate", 'guide');
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
        dispatcher.trigger("index:navigate", 'settings');
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
        dispatcher.trigger("index:navigate", 'more');
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

// Exports
exports.getActiveItem = function(){ return activeItem; };
