/**
 * lib.notifications
 */
var Alloy = require('alloy'),
    _ = Alloy._;

// Libaries
var log = require('utils/log');

var notifications = module.exports = {
    /**
     * @method increase
     * Increase the app badge with the given int
     * @param {Int} increase Number to increase of the current item
     * @param {Bool} silent If silent don't update the badge
     */
    increase: function (increase, silent) {
        log.info('[lib/notifications] Set badge count to ', increase);
        var currentBadgeCount = notifications.get();
        var newBadgeCount = currentBadgeCount + increase;
        Ti.App.Properties.setInt('app-badge-count', newBadgeCount);
        !silent && notifications.updateBadge();
    },
    /**
     * @method decrease
     * Decrease the app badge with the given int
     * @param {Int} decrease Number to decrease of the current item
     * @param {Bool} silent If silent don't update the badge
     */
    decrease: function (decrease, silent) {
        var currentBadgeCount = notifications.get();
        var newBadgeCount = currentBadgeCount - decrease >= 0 ? currentBadgeCount - decrease : 0;
        log.info('[lib/notifications] Decrease badge count - ', decrease, newBadgeCount);
        Ti.App.Properties.setInt('app-badge-count', newBadgeCount);
        !silent && notifications.updateBadge();
    },
    /**
     * @method set
     * Set app badge to arbitrary int
     * @param {Int} badgeCount New badge count int
     * @param {Bool} silent If silent don't update the badge
     */
    set: function (badgeCount, silent) {
        log.info('[lib/notifications] Set badge count to ', badgeCount);
        Ti.App.Properties.setInt('app-badge-count', badgeCount);
        !silent && notifications.updateBadge();
    },
    /**
     * @method get
     * @return {Int} Current badge count
     */
    get: function () {
        return Ti.App.Properties.getInt('app-badge-count');
    },
    /**
     * @method reset
     * Reset the badge to 0
     */
    reset: function () {
        Ti.App.Properties.setInt('app-badge-count', 0);
        notifications.updateBadge();
    },

    /**
     * @method updateBadge
     * Update iOS badge count
     */
    updateBadge: function () {
        if (OS_IOS) {
            Titanium.UI.iPhone.setAppBadge(notifications.get());
        }
    },
};
