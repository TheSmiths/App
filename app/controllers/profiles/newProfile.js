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
        if (config.flow === 'SURVEY') {
            STATE = 'SURVEY';
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
    if (STATE === 'SURVEY') {
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

    if (STATE === 'SURVEY') {
        //@todo: create a new survey model
        Alloy.createController('surveys/windspeed', { state: 'PRESURVEY'} );
        return;
    }
    args.parent && args.parent.fetchProfiles();
    $.getView().close();
}


function hideError () {
    $.spotterErrorContainer.visible = false;
}

function showError () {
    $.spotterErrorContainer.visible = true;
}
