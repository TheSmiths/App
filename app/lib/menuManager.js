/**
 * lib.menuManager
 */
var Alloy = require('alloy'),
    _ = Alloy._;

// Libaries
var log = require('utils/log');
var statusbar = require("com.apaladini.statusbar");

// Intenals
var menuState = 'CLOSED';

var menuManager = module.exports = {
    /**
     * [updateStatus description]
     * @return {[type]} [description]
     */
    updateStatus: function () {
        if (menuState === 'CLOSED') {
            statusbar.hide();
            menuState = 'OPEN';
            return menuState;
        }
        statusbar.show();
        menuState = 'CLOSED';
        return menuState;
    },
    /**
     * [getStatus description]
     * @return {[type]} [description]
     */
    getStatus: function () {
        return menuState;
    },
    /**
     * [setStatus description]
     * @param {[type]} status [description]
     */
    setStatus: function (status) {
        menuState = status;
        if (status === 'CLOSED') {
            statusbar.show();
            return;
        }

        statusbar.hide();
    }
};
