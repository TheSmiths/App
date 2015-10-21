/**
 * Controller for Settings
 *
 * @class Controllers.settings
 * @uses Utils.log
 * @uses Utils.date
 * @uses dispatcher
 */
var log = require('utils/log');
var date = require('utils/date');
var dispatcher = require('dispatcher');
var toast = require('toast');
var permissions = require('permissions');

// Collections
var surveys = Alloy.createCollection('Survey');
var remainingUploads = [];

_.extend($, {
    /**
     * @constructor
     * @method construct
     * @param {Object} config Controller configuration
     */
    construct: function(config) {
        // Set listeners
        surveys.on('add', onAddSurvey);
        surveys.on('remove', onRemoveSurvey);
        surveys.on('change', onChangeSurvey);
        dispatcher.on('survey:change', addedSurvey);
        dispatcher.on('survey:closed', closedSurvey);
        dispatcher.on('start:permissions', setPermissions);
        // Check if there are any surveys
        fetchSurveys();
        _.defer(updateNotificationBadge);
    },

    /**
     * @method destruct
     * function executed when closing window
     */
    destruct: function() {
        surveys.off('add', onAddSurvey);
        surveys.off('remove', onRemoveSurvey);
        surveys.off('change', onChangeSurvey);
        dispatcher.off('survey:change', addedSurvey);
        dispatcher.off('survey:closed', closedSurvey);
        dispatcher.off('start:permissions', setPermissions);
    }
});

/**
 * @method doClickStartGuide
 * Handle `click` on startSurvey button, create start survey controller
 */
function doClickStartSurvey () {
    require('flow').preSurvey();
}

/**
 * @method doClickStartGuide
 * Handle `click` on startGuide button, create guide controller
 */
function doClickStartGuide () {
    dispatcher.trigger('index:navigate', 'guide');
    dispatcher.trigger('menu:activate', 'menuItemGuide');
}

/**
 * @method onClickUploadButton
 * Call upload library to attempt an upload of all surveys
 * @todo: Implement feedback system
 */
function onClickUploadButton () {
    var reference = $;

    require('upload')(function (err, success) {
        if (err) {
            showError(err, reference);
            return;
        }

        // Update the list
        toast.showToastMessage(reference, 'surveys', L('upload.uploadedSurveys'));
        fetchSurveys();
    });
}

/**
 * @method showError
 * Show error message to the user
 * @param  {String} errorMessage Error message code as String
 * @todo: Create nice inline error messages
 */
function showError (errorMessage, reference) {
    if (errorMessage === 'NOINTERNET') {
        return toast.showToastMessage(reference, 'surveys', L('upload.noInternet'));
    }

    if (errorMessage === 'NOSURVEYS') {
        return toast.showToastMessage(reference, 'surveys', L('upload.noUploadableSurveys'));
    }
    // Generic error
    toast.showToastMessage(reference, 'surveys',L('upload.failed'));
}


/**
 * @method  onAddSurvey
 * @param  {[type]} model      [description]
 * @param  {[type]} collection [description]
 * @param  {[type]} options    [description]
 * @return {[type]}            [description]
 */
function onAddSurvey (model, collection, options) {
    log.info('[surveys] Adding a survey model', model);

    if (model.get('uploaded') == 0) {
        addUploadSurvey(model.get('survey_id'));
    } else {
        removeUploadSurvey(model.get('survey_id'));
    }

    var surveyDataRow = Alloy.createController('surveyInfo/surveyInfoRow', {model: model}).getView();
    $.surveyTableView.appendRow(surveyDataRow);
}

/**
 * @method onRemoveProfile
 * @param  {[type]} model      [description]
 * @param  {[type]} collection [description]
 * @param  {[type]} options    [description]
 * @return {[type]}            [description]
 */
function onRemoveSurvey (model, collection, options) {
    if (collection.length === 0) {
        $.profilesTableView.visible = false;
        $.emptyView.visible = true;
    }
    $.profilesTableView.deleteRow(options.index);
    removeUploadSurvey(model.get('survey_id'));
}

/**
 * @method onChangeSurvey
 * @param  {[type]} model      [description]
 * @param  {[type]} collection [description]
 * @param  {[type]} options    [description]
 * todo also update the visual representation
 */
function onChangeSurvey (model, collection, options) {
    if (model.changed && model.changed.uploaded == 0) {
        addUploadSurvey(model.get('survey_id'));
    }

    if (model.changed && model.changed.uploaded == 1) {
        removeUploadSurvey(model.get('survey_id'));
    }
}


/**
 * @method fetchSurveys
 * Fetch surveys from the datbase, update the view based on results
 */
function fetchSurveys () {
    $.surveyTableView.data = [];

    surveys.fetch({
        silent: false,
        success: function(collection, response, options) {
            log.info('[surveys] Retreived surveys', collection);
            if (collection.length === 0) {
                return;
            }
            $.emptyView.visible = false;
            $.surveyTableView.visible = true;
        },
        error: function(collection, response, options) {
            log.info('[surveys] Unable to retreive the survey', response);
        }
    });
}

/**
 * @method addedSurvey
 * Also upload if there is internet available
 */
function addedSurvey () {
    fetchSurveys();

    _.delay(function () {
        if (Titanium.Network.online) {
            onClickUploadButton();
        }
    }, 2000);

}

/**
 * @method addUploadSurvey
 * ADd surveyId to remainingUploads array and update header
 * @param {String} surveyId
 */
function addUploadSurvey (surveyId) {
    if (remainingUploads.indexOf(surveyId) === -1) {
        remainingUploads.push(surveyId);
    }
    $.uploadButtonContainer.opacity = 1;
    updateNotificationBadge();
}

/**
 * @method removeUploadSurvey
 * Remove upload survey from the list as it has been uploaded, in order to keep track of remaining uploads
 * @param {String} surveyId
 */
function removeUploadSurvey (surveyId) {
    remainingUploads = _.reject(remainingUploads, function (id) { return id === surveyId; } );

    $.uploadButtonContainer.opacity = 0.3;
    updateNotificationBadge();
}

/**
 * @method closedSurvey
 *
 * Handle closed survey, fetch all surveys and update badge
 */
function closedSurvey () {
    // Fetch surveys
    fetchSurveys();
    // Update notifications
    // Reset (hack)
    remainingUploads = [];
    surveys.each(function (survey) {
        var surveyId = survey.get('survey_id');

        if (survey.get('uploaded') == 0) {
            addUploadSurvey(surveyId);
        } else {
            removeUploadSurvey(surveyId);
        }
    });
    // Set notifcation
    _.defer(updateNotificationBadge);
}

/**
 * @method setPermissions
 *
 * Call permissions after intro movie to prevent permission alerts in video experience on iOS
 */
function setPermissions () {
    console.log('***** updating permissions');
    permissions.init();
}

/**
 * @method updateNotificationBadge
 * Set the badge on upload button to reflect # of remaining uploads
 * @todo: Animate
 */
function updateNotificationBadge () {
    var notificationCount = remainingUploads.length;

    if (notificationCount === 0) {
        $.notificationContainer.setVisible(false);
        require('notifications').set(0);
        return;
    }

    $.notificationCount.text = notificationCount;
    $.notificationContainer.setVisible(true);

    // Also update the badge number to correspond
    require('notifications').set(remainingUploads.length);
}
