/**
 * Controller for index
 *
 * Reset app badge, check for active survey if not load the default surveys page and menu
 *
 * @class Controllers.index
 */
var dispatcher = require('dispatcher');
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
        // Reset badge once opening the app to remove local notifications
        if (!Ti.Geolocation.locationServicesEnabled) {
            log.error('[surveys] Please enable location services');
        }

        if (Ti.Platform.name == "iPhone OS" && parseInt(Ti.Platform.version.split(".")[0]) >= 8) {
            Ti.App.iOS.registerUserNotificationSettings({
                types: [
                    Ti.App.iOS.USER_NOTIFICATION_TYPE_ALERT,
                    Ti.App.iOS.USER_NOTIFICATION_TYPE_SOUND,
                    Ti.App.iOS.USER_NOTIFICATION_TYPE_BADGE
                ]
            });
        }

        // Check if we have an active survey, if so open the app in active survey mode
        if (require('survey').activeSurvey()) {
            Alloy.createController('surveys/survey', {startedFromRoot: true});
            return;
        }

        // Take care of Drawer navigation
        Alloy.Globals.drawer = initDrawer();
        if(OS_IOS) {
            Alloy.Globals.navigationWindow = $.navigationWindow;
            Alloy.Globals.menu = $.menu;
        }
    },

    /**
     * @method destruct
     * function executed when closing window
     */
    destruct: function() {
    }
});

/**
 * Handle drawer init for both platforms
 * @method initDrawer
 * @return {View} the drawer
 */
function initDrawer() {
    var drawerOpen = function (evt) { dispatcher.trigger('menuDidOpen'); },
        drawerClose = function (evt) { dispatcher.trigger('menuDidClose'); };

    if (OS_IOS) {
        $.drawer.open();
        $.drawer.addEventListener('willShowMenuViewController', drawerOpen);
        $.drawer.addEventListener('willHideMenuViewController', drawerClose);
        return $.drawer;
    }
    // * ANDROID *
    // define menu and main content view
    $.drawer.leftView = Alloy.createController('menu').getView();
    $.drawer.centerView = Alloy.createController('surveys').getView();
    $.drawer.addEventListener('draweropen', drawerOpen);
    $.drawer.addEventListener('drawerclose', drawerClose);

    $.droidWindow.addEventListener('open',function(){
        var activity = $.droidWindow.getActivity();
        if (activity){
            var actionBar = activity.getActionBar();
            if (actionBar){
                actionBar.displayHomeAsUp = true;
                actionBar.onHomeIconItemSelected=function(){
                  $.drawer.toggleLeftWindow();
                }
            }
        }
    })
    $.droidWindow.open();
}
