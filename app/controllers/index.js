/**
 * Controller for index
 *
 * @class Controllers.index
 */

/**
 * Initializes the controller
 */
_.extend($, {
    /**
     * @constructor
     * @method construct
     * @param {Object} config Controller configuration
     */
    construct: function(config) {
        // Check if we have an active survey, if so open the app in active survey mode
        if (require('survey').activeSurvey()) {
            Alloy.createController('surveys/survey', {startedFromRoot: true});
            return;
        }

        Alloy.Globals.drawer = $.drawer;
        Alloy.Globals.navigationWindow = $.navigationWindow;
        Alloy.Globals.menu = $.menu;
        $.drawer.open();

        $.drawer.addEventListener('windowDidOpen', function (evt) {
            Ti.App.fireEvent('menuDidOpen');
        });

        $.drawer.addEventListener('windowDidClose', function (evt) {
            Ti.App.fireEvent('menuDidClose');
        });
    },

    /**
     * @method destruct
     * function executed when closing window
     */
    destruct: function() {
    }
});
