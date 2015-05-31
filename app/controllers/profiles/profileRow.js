/**
 * Controller for the profileRow componenent
 *
 * Generate tableView profile Row based on model data
 *
 * @class Controllers.profiles.profileRow
 */

//Internals
var model;

_.extend($, {
    /**
     * @constructor
     * @method construct
     * @param {Object} config Controller configuration
     */
    construct: function(config) {
        model = config.model;
        if (!model) {
            return;
        }

        // Populate row
        $.user.text = model.get('name');
        var userInfo = 'Platform height: ' + model.get('height') + 'm, Surveys: ' + model.get('surveys');
        $.profileRow.modelId = model.get('id');
        $.userInfo.text = userInfo;
    },

    /**
     * @method destruct
     * function executed when closing window
     */
    destruct: function() {

    }
});

/**
 * @method onClickDeleteUser
 * Handle `click` on profile row, propagate click event
 * @param  {Object} evt Event information
 */
function onClickProfileRow (evt) {
    evt.model = model;
    $.trigger('click', evt);
}
