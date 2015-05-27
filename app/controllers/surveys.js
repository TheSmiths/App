/**
 * Controller for Settings
 *
 * @class Controllers.settings
 * @uses Utils.log
 * @uses Utils.date
 */
var log = require('utils/log');
var date = require('utils/date');

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
        // Check if there are any surveys
        fetchSurveys();
        Ti.App.addEventListener('newSurvey', fetchSurveys);
    },

    /**
     * @method destruct
     * function executed when closing window
     */
    destruct: function() {
        surveys.off('add', onAddSurvey);
        surveys.off('remove', onRemoveSurvey);
        surveys.off('change', onChangeSurvey);
    }
});

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

    if (!model.get('uploaded') || model.get('uploaded') == 0) {
        addUploadSurvey(model.get('survey_id'));
    }

    if (!model.get('uploaded') || model.get('uploaded')) {
        removeUploadSurvey(model.get('survey_id'));
    }

    var surveyDataRow = Alloy.createController('surveyInfo/surveyInfoRow', {model: model}).getView();
    $.surveyTableView.appendRow(surveyDataRow);
    shadowSurveys.push(model.get('survey_id'));
}

/**
 * [onRemoveProfile description]
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

// @todo also update the visual representation
function onChangeSurvey (model, collection, options) {
    if (model.changed && model.changed.uploaded == 0) {
        addUploadSurvey(model.get('survey_id'));
    }

    if (model.changed && model.changed.uploaded) {
        removeUploadSurvey(model.get('survey_id'));
    }
}

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
 * @method fetchSurveys
 * @return {[type]} [description]
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

function onClickUploadButton () {
    require('upload')();
}

/**
 * [addUploadSurvey description]
 */
function addUploadSurvey (surveyId) {
    console.log('***** Add survey');
    remainingUploads.push(surveyId);
    $.uploadButtonContainer.opacity = 1;
}

function removeUploadSurvey (surveyId) {
    remainingUploads = _.reject(remainingUploads, function (id) { return id === surveyId; } );

    if (remainingUploads === 0 ) {
        $.uploadButtonContainer.opacity = 0.3;
    }
}
