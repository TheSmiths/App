/**
 * Controller for the guide
 *
 * @class Controllers.guide.guideDetail
 * @uses utils.log
 * @uses data.guide
 */
var log = require('utils/log');

_.extend($, {
    /**
     * @constructor
     * @method construct
     * @param {Object} config Controller configuration
     */
    construct: function(config) {
        var guideDetailsSourceData = require('data/guide').guideDetails[config.guideIndex];
        buildPage(guideDetailsSourceData);
        // Open the window in dialog if the window is requested from other than the guide
        if (config.dialog) {
            $.getView().open({modal:true});
        }
    },

    /**
     * @method destruct
     * function executed when closing window
     */
    destruct: function() {
    }
});

/**
 * @method onClickBackButton
 * @parems {Object} evt
 */
function onClickBackButton (evt) {
    $.getView().close();
}

/**
 * @method buildPage
 * @param  {Array} guideDetailData Array of objects containing the data of the guide details page
 */
function buildPage (guideDetailData) {
    _.each(guideDetailData, function (content) {
        var guideDetailType = _.keys(content);
        if (guideDetailType[0] === 'heading') {
            $.headerTitle.text = content[guideDetailType[0]];
            return;
        }

        var label = $.UI.create('Label', {
            text: content[guideDetailType[0]],
            classes: guideDetailType
        });

        $.paddingContainer.add(label);
    });
}
