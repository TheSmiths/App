/**
 * @component toast
 *
* Controller for the toast component
 *
 */
var animation = require('alloy/animation'),
    windowReference,
    openInWindow,
    parentView,
    callback;

//typeIcon hashmap
var typeIcon = {
    'settings': 'navigation/settings.png',
    'profile': 'navigation/profile.png',
    'surveys': 'navigation/surveys.png'
};

_.extend($, {
    /**
     * @constructor
     *
     * @param  {Object} config Controller configuration
     */
    construct: function(config) {
        openInWindow = config.openInWindow;
        parentView = config.parentView;
        callback = config.callback;

        setType(config.type);
        setMessage(config.message);

        if (!config.openInWindow) {
            parentView.getView().add($.getView());
            _.defer(show);
            return;
        }

        windowReference = Ti.UI.createWindow({ backgroundColor: 'transparent'});
        windowReference.add($.getView());
        windowReference.addEventListener('open', show);
        windowReference.open({animated: false});
    },
    destruct: function() { }
});


/**
 * Set the toastType
 * @private
 */
function setType (_type) {
    var type = 'settings';

    if (_.contains(['settings', 'profile', 'surveys'], _type)){
        type = _type;
    }

    $.toastIcon.image = '/images/' + typeIcon[type];
}

/**
 * Set message of the toast
 * @private
 */
function setMessage (message) {
    if (!message) {
        return;
    }

    $.toastMessage.text = message;
    $.toastMessage.height = Ti.UI.SIZE;
}

/**
 * Function to initiate (and later hide) the toast message
 * @private
 */
function show () {
    // Show animation
    showToastAnimationChain();
    // Hide animation
    _.delay(hideToastAnimation, 1000);
}

/**
 * showToastAnimationChain Animation
 * @private
 *
 * Resize the toast to 10% its original size, show it, size it up to 1.1 in 170ms then finally set to scale 1.
 */
function showToastAnimationChain () {
    var matrix = Ti.UI.create2DMatrix(),
        shrinkMatrix = matrix.scale(0.1, 0.1),
        shrink = Titanium.UI.createAnimation({
            transform: shrinkMatrix,
            duration: 1
        }),
        growMatrix = matrix.scale(1.1, 1.1),
        grow = Titanium.UI.createAnimation({
            transform: growMatrix,
            opacity: 1,
            duration: 170
        }),
        stopMatrix = matrix.scale(1,1),
        stop = Titanium.UI.createAnimation({
            transform: stopMatrix,
            duration: 25
        });

    animation.chainAnimate($.toastContainer, [shrink, grow, stop]);
}

/**
 * hideToastAnimation Animation
 * @private
 *
 * Hide the toast message
 *
 * @return {function} callback
 */
function hideToastAnimation () {
    var matrix = Ti.UI.create2DMatrix();
    var removeMatrix = matrix.scale(0.01, 0.01);

    var remove = Titanium.UI.createAnimation({
        transform: removeMatrix,
        duration: 100,
        opacity: 0
    });

    animation.chainAnimate($.toastContainer, [remove], function () {
        if (!openInWindow) {
            parentView.getView().remove($.getView());
        } else {
            windowReference.close({animated: false});
        }

        callback && callback();
    });
}
