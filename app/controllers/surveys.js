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

// Collections
var surveys = Alloy.createCollection('Survey');
var shadowSurveys = [];
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
        dispatcher.on('newSurvey', fetchSurveys);
        // Check if there are any surveys
        fetchSurveys();
    },

    /**
     * @method destruct
     * function executed when closing window
     */
    destruct: function() {
        surveys.off('add', onAddSurvey);
        surveys.off('remove', onRemoveSurvey);
        surveys.off('change', onChangeSurvey);
        dispatcher.off('newSurvey', fetchSurveys);
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
    var guide = Alloy.createController('guide').getView();
    Alloy.Globals.navigationWindow.openWindow(guide, {animated: false});
    Alloy.Globals.menu.activateItem('menuItemGuide');
}

/**
 * @method onClickUploadButton
 * Call upload library to attempt an upload of all surveys
 * @todo: Implement feedback system
 */
function onClickUploadButton () {
    require('upload')();
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
    if (_.contains(shadowSurveys, model.get('survey_id'))) {
        return;
    }

    console.log('***** model.get(uploaded)', model.get('uploaded'));

    if (!model.get('uploaded') || model.get('uploaded') == 0) {
        addUploadSurvey(model.get('survey_id'));
    }

    if (!model.get('uploaded') || model.get('uploaded') == 1) {
        removeUploadSurvey(model.get('survey_id'));
    }

    var surveyDataRow = Alloy.createController('surveyInfo/surveyInfoRow', {model: model}).getView();
    $.surveyTableView.appendRow(surveyDataRow);
    shadowSurveys.push(model.get('survey_id'));
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
    shadowProfiles = _.reject(shadowProfiles, function (id) { return id === model.get('survey_id'); } );
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
 * @method addUploadSurvey
 * ADd surveyId to remainingUploads array and update header
 * @param {String} surveyId
 */
function addUploadSurvey (surveyId) {
    remainingUploads.push(surveyId);

    if (OS_IOS) {
        $.uploadButtonContainer.opacity = 1;
        updateNotificationBadge();
    }
}

/**
 * @method removeUploadSurvey
 * Remove upload survye from the list as it has been uploaded, in order to keep track of remaining uploads
 * @param {String} surveyId
 */
function removeUploadSurvey (surveyId) {
    remainingUploads = _.reject(remainingUploads, function (id) { return id === surveyId; } );

    if (OS_IOS) {
        updateNotificationBadge();
        $.uploadButtonContainer.opacity = 0.3;
    }
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
        return;
    }

    $.notificationCount.text = notificationCount;
    $.notificationContainer.setVisible(true);
}
