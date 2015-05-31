/**
 * Controller for Profiles
 *
 * @class Controllers.profiles
 * @uses utils.log
 */
var log = require('utils/log');

// Internals
var profiles = Alloy.createCollection('Profile');
var STATE = 'PROFILE';
var dispatcher = require('dispatcher');

_.extend($, {
    /**
     * @constructor
     * @method construct
     * @param {Object} config Controller configuration
     */
    construct: function(config) {
        // Set state
        STATE = config.flow || STATE;
        if (STATE === 'PRESURVEY') {
            $.menuButton.hide();
            $.closeButton.show();
            $.headerTitle.text = L('profiles.surveyTitle');
            require('windowManager').openWinWithBack($.getView());
        }

        profiles.on('add', onAddProfile);
        profiles.on('remove', onRemoveProfile);
        // Fetch data
        fetchProfiles();

        dispatcher.on('profile:change', fetchProfiles);
    },

    /**
     * @method destruct
     * function executed when closing window
     */
    destruct: function() {
        profiles.off('add', onAddProfile);
        profiles.off('remove', onRemoveProfile);
        dispatcher.off('profile:change', fetchProfiles);
    }
});

/**
 * @method  closeWindow
 * Close current window, only in survye mode
 * @param  {Object} evt
 */
function closeWindow (evt) {
    if (STATE === 'PRESURVEY') {
        require('windowManager').closeWin({animated: true});
    }
}

/**
 * @method  onAddProfile
 * @param  {[type]} model      [description]
 * @param  {[type]} collection [description]
 * @param  {[type]} options    [description]
 * @return {[type]}            [description]
 */
function onAddProfile (model, collection, options) {
    log.info('onAddProfile', model);
    var guideDataRow = Alloy.createController('profiles/profileRow', {model: model, state: STATE}).getView();
    $.profilesTableView.appendRow(guideDataRow);
}

/**
 * [onRemoveProfile description]
 * @param  {[type]} model      [description]
 * @param  {[type]} collection [description]
 * @param  {[type]} options    [description]
 * @return {[type]}            [description]
 */
function onRemoveProfile (model, collection, options) {
    if (collection.length === 0) {
        $.profilesTableView.visible = false;
        $.emptyView.visible = true;
    }
    $.profilesTableView.deleteRow(options.index);
}

/**
 * @method doClickNewProfile
 * Handle `click` on newProfile button, create profiles.newProfile controller
 * @param  {Object} evt
 */
function doClickNewProfile (evt) {
    // Throttle the button press to prevent multiple clicks
    setNewProfileOpacity(0.4);
    _.delay(_.partial(setNewProfileOpacity, 1), 150);
    Alloy.createController('profiles/profileDetails', { parent: $, flow: STATE });
}

/**
 * @method setNewProfileOpacity
 * Update the opacity of the newProfile button
 * @param {float) opacity
 */
function setNewProfileOpacity (opacity) {
    $.newProfile.opacity = opacity;
}

/**
 * @method doClickProfilesTableView
 * Handle `click` on tableView
 * @param  {[type]} model [description]
 * @return {[type]}       [description]
 */
function doClickProfilesTableView (model) {
    var profile = profiles.get(model.rowData.modelId);
    // If state is selection continue flow
    if (STATE === 'PRESURVEY') {
        require('flow').saveProfile({'observerName': profile.get('name'), 'platformHeight': profile.get('height'), 'id': profile.id});
        return;
    }

    Alloy.createController('profiles/profileDetails', { profile: profile });
}

/**
 * [fetchProfiles description]
 * @return {[type]} [description]
 */
function fetchProfiles () {
    $.profilesTableView.data = [];

    profiles.fetch({
        silent: false,
        success: function(collection, response, options) {
            log.info('[profiles] Retreived profiles', collection);
            if (collection.length === 0) {
                return;
            }

            $.emptyView.visible = false;
            $.profilesTableView.visible = true;
        },
        error: function(collection, response, options) {
            log.info('[profiles] Unable to retreive profiles', response);
            // @todo Set error state
        }
    });
}
// Export fetchProfiles
exports.fetchProfiles = fetchProfiles;
