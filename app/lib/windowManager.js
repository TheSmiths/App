
var _navWindows = []; //Array holding all opened NavigationWindows
var _closableWindows = []; //Array holding all opened Windows

var WM = module.exports = {

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
            _navWindows.push(navWindow);
            return navWindow;
        }
    },

    openWinInNewWindow: function(win, openProperties) {
        if (OS_IOS) {
            WM.createNewNavWindow(win).open(openProperties);
        } else {
            win.open(openProperties);
        }
    },

    /**
     * Open given Window in a the last created Ti.UI.iOS.NavigationWindow on iOS. Just open the Window on other platforms
     *
     * @param {Ti.UI.Window} win Window to open in NavigationWindow
     */
    openWinWithBack: function(win, openProperties) {
        if(OS_IOS) {
            if (!_navWindows.length) {
                WM.createNewNavWindow(win).open(openProperties);
            } else {
                _.last(_navWindows).openWindow(win, openProperties);
                _closableWindows.push(win);
            }
        } else {
            win.addEventListener('open', doOpenWindowWithBack);
            win.open(openProperties || {});
        }
    },

    openModal: function(win, openProperties) {
        if (OS_IOS) {
            openProperties = openProperties || {};
            win.open(_.extend(openProperties, {modal:true}));
        } else {
            win.open(openProperties);
        }
    },

    closeWin: function (closeProperties) {
        if (_closableWindows.length) {
            _.last(_closableWindows).close(closeProperties);
            _closableWindows.pop();
        }
    },

    closeNav: function (closeProperties) {
        if(OS_ANDROID) { return WM.closeWin(closeProperties); }
        if (_navWindows.length) {
            // Forget about all insider windows
            _closableWindows = [];
            _.last(_navWindows).close(closeProperties);
            _navWindows.pop();
        }
    },

    setActiveNavWindow: function(activeWin) {
        _navWindows.push(activeWin);
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
