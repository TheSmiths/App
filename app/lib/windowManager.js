
var _navWindows = []; //Array holding all opened NavigationWindows

var WM = module.exports = {
    closableWindows: [],

    /**
     * Opens given Window in a new Ti.UI.iOS.NavigationWindow on iOS and returns the new NavWindow. Does nothing on other platforms
     *
     * @param {Ti.UI.Window} win Window to open in NavigationWindow
     *
     * @return {Ti.UI.iOS.NavigationWindow} Created NavigationWindow
     */
    createNewNavWindow: function(win) {
        if (OS_IOS) {
            var navWindow = Ti.UI.iOS.createNavigationWindow({
                includeOpaqueBars: true,
                autoAdjustScrollViewInsets: false,
                fullscreen: true,
                window: win
            });

            navWindow.id = 'navWindow_' + _.uniqueId();

            _navWindows.push(navWindow);

            // Store reference in the root Window to the NavigationWindow
            win.navWin = navWindow;

            return navWindow;
        } else
            return win;
    },

    /**
     * Open given Window in a the last created Ti.UI.iOS.NavigationWindow on iOS. Just open the Window on other platforms
     *
     * @param {Ti.UI.Window} win Window to open in NavigationWindow
     */
    openWinInActiveNavWindow: function(win, openProperties) {
        if (OS_IOS) {
            if (!_navWindows.length) {
                WM.createNewNavWindow(win).open(openProperties);
            } else {
                _.last(_navWindows).openWindow(win, openProperties);
            }
        } else {
            win.open();
        }
    },

    openWinInNewWindow: function(win, openProperties) {
        if (OS_IOS) {
            WM.createNewNavWindow(win).open(openProperties);
        } else {
            win.open();
        }
    },

    openWinWithBack: function(win, openProperties) {
        if(OS_ANDROID) {
            win.addEventListener('open', doOpenWindowWithBack);
            win.open(openProperties || {});
        }
        else {
            WM.openWinInActiveNavWindow(win, openProperties);
        }
    },

    closeWin: function (closeProperties) {
        if (_navWindows.length) {
             _.last(_navWindows).close(closeProperties);
             _navWindows.pop();
        }
    }
};


/**
 * Handle `open` event on Window
 * @private
 *
 * Adds `DisplayHomeAsUp` to the Window
 *
 * @param {Object} evt Event details
 */
function doOpenWindowWithBack(evt) {
    var win = this;

    win.removeEventListener('open', doOpenWindowWithBack);

    if(OS_ANDROID) {
        var activity = win.activity;

        if (activity.actionBar) {
            activity.actionBar.setDisplayHomeAsUp(true);
        }

        activity.actionBar.onHomeIconItemSelected = function() {
            win.close({
                activityEnterAnimation: Titanium.App.Android.R.anim.slide_in_left,
                activityExitAnimation: Titanium.App.Android.R.anim.slide_out_right
            });
        };
    }
}
