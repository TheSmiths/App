/**
 * Controller for profiles newProfile
 *
 * @class Controllers.profiles.newProfile
 * @uses utils.log
 * @uses dispatcher

 */
var log = require('utils/log');
var dispatcher = require('dispatcher');
var WM = require('windowManager');



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
            STATE = config.flow;

            if (OS_IOS) {
                WM.openWinInNewWindow($.getView(), { title: L('profiles.profileDetails.title') });
            } else {
                WM.openWinWithBack($.getView(), { title: L('profiles.profileDetails.title') } ); 
            }

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

        WM.openModal($.getView(), { title: L('profiles.profileDetails.title') });
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
        WM.closeNav({animated: true});
        return;
    }
    // Modal
    $.getView().close({ animated : true });
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
    hideErrors();

    // Validation
    if (profileName.length < 2) {
        showError('name');
        return;
    }

    if (boat.length < 2) {
        showError('boat');
        return;
    }

    // If edit
    if (profileModel) {
        profileModel.set('name', profileName);
        profileModel.set('height', platformHeight);
        profileModel.set('boat', boat);
        profileModel.save();
        closeViewWithUpdate();
        // Show message to user
        dispatcher.trigger('profile:update');
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

    dispatcher.trigger('profile:new');
    // Fetch the updated list in order to visualise added profile
    closeViewWithUpdate();
}

/**
 * @method closeViewWithUpdate
 * Triger update and close view
 */
function closeViewWithUpdate () {
    dispatcher.trigger('profile:change');
    WM.closeWin();
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
        // Show message to user
         dispatcher.trigger('profile:delete');
    });

    dialog.show();
}

/**
 * @method hideError
 * Set error container visibility to false, hiding the error
 */
function hideErrors () {
    $.spotterErrorContainer.visible = false;
    $.boatErrorContainer.visible = false;
}

/**
 * @method showError
 * Set error container visibility to true, showing the error
 * @param  [String} errorType
 */
function showError (errorType) {
    if (errorType === 'name') {
        return $.spotterErrorContainer.visible = true;
    }

    $.boatErrorContainer.visible = true;
}
