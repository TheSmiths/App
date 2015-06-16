/**
 * Controller for the guide
 *
 * @class Controllers.guide
 * @uses utils.log
 * @uses data.guide
 */
var log = require('utils/log');

// Data
var guideSourceData = require('data/guide').guidePages;

_.extend($, {
    /**
     * @constructor
     * @method construct
     * @param {Object} config Controller configuration
     */
    construct: function(config) {
        var guideData = [];

        _.each(guideSourceData, function (label, index) {
            log.info(label, index);
            var guideDataRow = Alloy.createController('guide/guideRow', {
                id: index,
                label: label,
            }).getView();

            guideData.push(guideDataRow);
        });

        $.guideTableView.setData(guideData);
    },

    /**
     * @method destruct
     * function executed when closing window
     */
    destruct: function() {
    }
});

/**
 * [onClickTableView description]
 * @param  {[type]} evt [description]
 * @return {[type]}     [description]
 */
function onClickTableView (evt) {
    var guide = Alloy.createController('guide/guideDetail', { guideIndex: evt.index }).getView();
    require('windowManager').openWinInActiveNavWindow(guide, {animated: false});
}
