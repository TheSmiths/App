
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

    openWinInNewWindow: function(win, options) {
        setTitleIfAny(win, options);
        if (OS_IOS) {
            WM.createNewNavWindow(win).open(options);
        } else {
            _closableWindows.push(win);
            win.open(options);
        }
    },

    /**
     * Open given Window in a the last created Ti.UI.iOS.NavigationWindow on iOS. Just open the Window on other platforms
     *
     * @param {Ti.UI.Window} win Window to open in NavigationWindow
     */
    openWinWithBack: function(win, options) {
        setTitleIfAny(win, options);
        if(OS_IOS) {
            if (!_navWindows.length) {
                WM.createNewNavWindow(win).open(options);
            } else {
                _.last(_navWindows).openWindow(win, options);
                _closableWindows.push(win);
            }
        } else {
            _closableWindows.push(win);
            win.addEventListener('open', doOpenWindowWithBack);
            win.addEventListener('close', doCloseWindowWithBack);
            win.open(options);
        }
    },

    openModal: function(win, options) {
        setTitleIfAny(win, options);
        if (OS_IOS) {
            options = options || {};
            win.open(_.extend(options, {modal:true}));
        } else {
            WM.openWinWithBack(win, options);
        }
    },

    closeWin: function (closeProperties) {
        if (_closableWindows.length) {
            Ti.API.warn("closeWin >", _closableWindows.length);
            var win = _.last(_closableWindows);
            if(OS_ANDROID) {
                win.removeEventListener('close', doCloseWindowWithBack);
            }
            win.close(closeProperties);
            _closableWindows.pop();
        }
    },

    closeNav: function (closeProperties) {
        if(OS_ANDROID) {
            Ti.API.warn("CloseNav", _navWindows.length);
            // Close all windows
            _(_closableWindows.length).times(function() { WM.closeWin(); });
            return;
        }
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
            WM.closeWin({
                activityEnterAnimation: Titanium.App.Android.R.anim.slide_in_left,
                activityExitAnimation: Titanium.App.Android.R.anim.slide_out_right
            });
        };
    }
}

/* Set a title for a window in android if any
 * 
 * @param win The targetted window
 * @param option The window's options, might contain a title field or not.
 * */
function setTitleIfAny (win, options) {
    if (options && options.title) {
        if (OS_ANDROID) {
            win.addEventListener('open', (function (_win, _title) {
                return (function () {
                    _win.getActivity().getActionBar().setTitle(_title);
                });
            })(win, options.title));
        }
        delete options.title;
    }
}
/**
 * Will close an Android modal-like window
 * @method doCloseWindowWithBack
 * @param {Object} evt Event details
 */
function doCloseWindowWithBack(evt) {
    _closableWindows.pop();
}
