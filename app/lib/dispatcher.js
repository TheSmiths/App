/**
 * lib.dispacher
 *
 * Event dispatcher
 */
var Alloy = require('alloy'),
    _ = Alloy._,
    Backbone = Alloy.Backbone;

module.exports = _.clone(Backbone.Events);

