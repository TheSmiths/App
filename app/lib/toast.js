/**
 * lib.toast
 *
 * Show a brief toast
 * @constructor
 *
 */

var Alloy = require('alloy'),
    _ = Alloy._;

var toastMessageActive = false,
    notification;

var toastMessage = module.exports = {
    showToastMessage: function(parentView, type, message, openInWindow, duration, offSetX, offSetY) {
        if(!toastMessageActive) {
            if(OS_ANDROID) {
                var _duration = duration || true,
                    _offsetX = offSetX || 100,
                    _offsetY = offSetY || 75;

                notification = Ti.UI.createNotification({message:message});

                if(_duration) {
                    notification.duration = Ti.UI.NOTIFICATION_DURATION_LONG;
                } else {
                    notification.duration = Ti.UI.NOTIFICATION_DURATION_SHORT;
                }

                // Optionally, set the X & Y Offsets, by default 100, 75
                notification.offsetX = _offsetX;
                notification.offsetY = _offsetY;
                // Show notification
                notification.show();
                _.delay(toastMessage.hideToastMessage, 2000);
            }

            if(OS_IOS) {
                var toastWidget = Alloy.createWidget('nl.harriepieters.toast', {
                    'parentView': parentView,
                    'type': type,
                    'message': message,
                    'openInWindow': openInWindow,
                    'callback': function () {
                        toastMessageActive = false;
                    }
                });
            }

            toastMessageActive = true;
        }
    },
    hideToastMessage: function() {
        toastMessageActive = false;
        if (notification) {
            notification.hide();
            notification = null;
        }
    },
};
