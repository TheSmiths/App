/**
 * Controller for surveys done
 *
 * Let the user know the survey is stored succesfully
 *
 * @class Controllers.surveys.comment
 * @uses utils.log
 */
var log = require('utils/log');

_.extend($, {
    /**
     * @constructor
     * @method construct
     * @param {Object} config Controller configuration
     */
    construct: function(config) {
        require('windowManager').openWinWithBack($.getView());
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
 * Handle `click` on backButton
 */
function onClickBackButton () {
    $.getView().close({animated: true});
}


/**
 * @method doClickDone
 * Handle `click` on done butto
 */
function doClickDone () {
    Ti.App.fireEvent('newSurvey');
    require('flow').done();
}
