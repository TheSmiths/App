/**
 * Controller for profiles newProfile
 *
 * @class Controllers.profiles.newProfile
 * @uses utils.log
 */
var log = require('utils/log');
var dispatcher = require('dispatcher');

// Internal
var navWindow;
var STATE = 'PROFILE';
var profileModel;

_.extend($, {
    /**
     * @constructor
     * @method construct
     * @param {Object} config Controller configuration
     */
    construct: function(config) {
        // If flow is survey start as standalone navigation group
        if (config.flow === 'PRESURVEY') {
            STATE = 'PRESURVEY';
            require('windowManager').openWinWithBack($.getView());
            return;
        }

        if (config.profile) {
            profileModel = config.profile;
            $.deleteProfile.setVisible(true);
            $.saveProfile.setText(L('profiles.profileDetails.edit'));
            $.spotter.value = profileModel.get('name');
            $.platformHeight.value = profileModel.get('height');
            $.boat.value = profileModel.get('boat');
        }

        $.getView().open({modal:true});
    },

    /**
     * @method destruct
     * function executed when closing window
     */
    destruct: function() {
    }
});

/**
 * @method closeWindow
 * Close current window
 */
function closeWindow (evt) {
    if (STATE === 'PRESURVEY') {
        require('windowManager').closeWin({animated: true});
    }

    $.getView().close();
}

/**
 * @method onChangeUpdateHeight
 * Handle `change` of slider, update label to display height
 * @param  {Object} evt
 */
function onChangeUpdateHeight (evt) {
    var height = Math.floor(evt.value);
    $.height.text = height + ' meter';
}

/**
 * @method saveProfile
 * Handle `click` on save
 * @param  {Object} evt
 */
function saveProfile (evt) {
    var profileName = $.spotter.value.trim();
    var platformHeight = Math.floor($.platformHeight.value) || 0;
    var boat = $.boat.value.trim();

    // Reset validation
    hideError();

    // Validation
    if (profileName.length < 2) {
        showError();
        return;
    }

    // If edit
    if (profileModel) {
        profileModel.set('name', profileName);
        profileModel.set('height', platformHeight);
        profileModel.set('boat', boat);
        profileModel.save();
        closeViewWithUpdate();
        return;
    }

    // Else new
    var currentTime = new Date().getTime();
    var model = Alloy.createModel('Profile', {
        "name": profileName,
        "height": platformHeight,
        "boat": boat,
        "created": currentTime
    });
    model.save();

    if (STATE === 'PRESURVEY') {
        require('flow').saveProfile({'observerName': profileName, 'platformHeight': platformHeight, 'id': model.id});
        return;
    }

    // Fetch the updated list in order to visualise added profile
    closeViewWithUpdate();
}

/**
 * @method closeViewWithUpdate
 * Triger update and close view
 */
function closeViewWithUpdate () {
    dispatcher.trigger('profile:change');
    $.getView().close();
}

/**
 * @method deleteProfile
 * Handle `click` on delete, show dialog to make sure the user knows for sure
 * delete the profile from storage send update through the app
 * @param  {Object} evt
 */
function deleteProfile (evt) {
    // Check if we have an actual profile
    if (!profileModel) {
        alert(L('profiles.profileDetails.errorFailedToFindProfile'));
        return;
    }

    var dialog = Ti.UI.createAlertDialog({
        cancel: 1,
        buttonNames: [L('profiles.profileDetails.deleteProfile'), L('profiles.profileDetails.deleteProfileCancel')],
        message: L('profiles.profileDetails.deleteProfileMessage'),
        title:  L('profiles.profileDetails.deleteProfileTitle')
    });

    dialog.addEventListener('click', function(evt) {
        if (evt.index === evt.source.cancel){
            return;
        }

        profileModel.destroy();
        closeViewWithUpdate();

    });

    dialog.show();
}

/**
 * @method hideError
 * Set error container visibility to false, hiding the error
 */
function hideError () {
    $.spotterErrorContainer.visible = false;
}

/**
 * @method showError
 * Set error container visibility to true, showing the error
 */
function showError () {
    $.spotterErrorContainer.visible = true;
}
