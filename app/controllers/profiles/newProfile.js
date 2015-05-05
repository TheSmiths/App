/**
 * Controller for profiles newProfile
 *
 * @class Controllers.profiles.newProfile
 * @uses utils.log
 */
var log = require('utils/log');
var args = arguments[0] || {};

// Internal
var navWindow;
var STATE = 'PROFILE';

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
    var spotterName = $.spotter.value.trim();
    var platformHeight = Math.floor($.platformHeight.value) || 0;
    // Reset validation
    hideError();

    // Validation
    if (spotterName.length < 2) {
        showError();
        return;
    }

    var model = Alloy.createModel('Profile', {
        "name": spotterName,
        "height": platformHeight,
    });

    model.save();

    if (STATE === 'PRESURVEY') {
        require('flow').saveProfile({'observerName': spotterName, 'platformHeight': platformHeight});
        return;
    }

    // Fetch the updated list in order to visualise added profile
    args.parent && args.parent.fetchProfiles();
    $.getView().close();
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
