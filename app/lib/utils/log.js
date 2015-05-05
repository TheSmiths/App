var Alloy = require('alloy'),
    _ = Alloy._;

module.exports = {
    debug: function logDebug () {
        Ti.API.debug(stringify(arguments));
    },
    error: function logError (props) {
        Ti.API.error(stringify(arguments));
    },
    info: function logInfo () {
        Ti.API.info(stringify(arguments));
    },
    warn: function logWarn () {
        Ti.API.warn(stringify(arguments));
    }
};

/*
 * logs args with logFn to console
 * - logFn Function logging function
 * - args Array(like) collection of objects (e.g. arguments) that need to be logged
 */
function stringify (args) {
    args = _.map(args, function(item) {
        if (!item || !_.isObject(item)) {
            return item;
        }
        return JSON.stringify(item);
    });
    return [].join.call(args, ' ');
}
