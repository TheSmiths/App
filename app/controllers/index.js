/**
 * Controller for index
 *
 * Reset app badge, check for active survey if not load the default surveys page and menu
 *
 * @class Controllers.index
 */
var dispatcher = require('dispatcher');
var WM = require('windowManager');

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

        // Take care of platform navigation
        defineNavigation();
    },

    /**
     * @method destruct
     * function executed when closing window
     */
    destruct: function() {
    }
});

/**
 * On Menu event, open specified controller (platform specific)
 * @method navigateTo
 * @param  {String} controllerName navigation target
 */
function navigateTo(controllerName) {
    var controllerView = Alloy.createController(controllerName);
    if(OS_IOS) {
        var win = $.UI.create("Window", {});
        win.add(controllerView.getView());
        WM.openWinWithBack(win, {animated: false});
        $.drawer.hideMenuViewController();
    } else {
        $.drawer.setCenterView(controllerView.getView());
        $.drawer.closeLeftWindow();
    }
}

/**
 * Handle drawer init for both platforms
 * @method defineNavigation
 * @return {View} the drawer
 */
function defineNavigation() {
    var drawerOpen = function (evt) { dispatcher.trigger('menu:open'); },
        drawerClose = function (evt) { dispatcher.trigger('menu:close'); };

    if (OS_IOS) {
        WM.setActiveNavWindow($.navigationWindow);

        $.drawer.open();
        $.drawer.addEventListener('willShowMenuViewController', drawerOpen);
        $.drawer.addEventListener('willHideMenuViewController', drawerClose);
    } else {
        // define menu and main content view
        var menu = Alloy.createController('menu');
        $.drawer.leftView = menu.getView();
        $.drawer.centerView = Alloy.createController('surveys').getView();
        $.drawer.addEventListener('draweropen', drawerOpen);
        $.drawer.addEventListener('drawerclose', drawerClose);

        $.navigationWindow.addEventListener('android:back', function(){
            Ti.API.warn(">> menu.activeItem", menu.activeItem);
            if(menu.getActiveItem() != 'menuItemSurveys') {
                dispatcher.trigger('menu:activate', 'menuItemSurveys');
                navigateTo('surveys');
                return false;
            }
            $.navigationWindow.close();
        });
        $.navigationWindow.addEventListener('open',function(){
            var activity = $.navigationWindow.getActivity();
            if (activity){
                var actionBar = activity.getActionBar();
                if (actionBar){
                    actionBar.title = L('surveys.welcomeTitle');
                    actionBar.displayHomeAsUp = true;
                    actionBar.onHomeIconItemSelected=function(){
                        $.drawer.toggleLeftWindow();
                    }
                }
            }
        })
        $.navigationWindow.open();
    }
    dispatcher.on("index:navigate", function(name) {
        if (OS_ANDROID) {
            var activity = $.navigationWindow.getActivity(),
                actionBar = activity && activity.getActionBar();
            actionBar && actionBar.setTitle(L(name === "surveys" && "surveys.welcomeTitle" || "menu." + name));
        }
        navigateTo(name);
    });
    dispatcher.on("drawer:open", function() {
        OS_IOS && $.drawer.presentLeftMenuViewController();
        OS_ANDROID && $.drawer.openLeftWindow();
    });
    dispatcher.on("drawer:close", function() {
        OS_IOS && $.drawer.hideMenuViewController();
        OS_ANDROID && $.drawer.closeLeftWindow();
    });
}
