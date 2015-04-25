/**
 * Controller for the guide
 *
 * @class Controllers.guide.guideDetails
 * @uses utils.log
 * @uses data.guide
 */
var log = require('utils/log');

// Data


_.extend($, {
    /**
     * @constructor
     * @method construct
     * @param {Object} config Controller configuration
     */
    construct: function(config) {
        var guideDetailsSourceData = require('data/guide').guideDetails[config.guideIndex];
        buildPage(guideDetailsSourceData);
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
 * @param  {[type]} guideDetailData [description]
 * @return {[type]}                 [description]
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
