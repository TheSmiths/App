/**
 * Controller for the guide
 *
 * @class Controllers.guide.guideDetail
 * @uses utils.log
 * @uses data.guide
 */
var log = require('utils/log');
var WM = require('windowManager');

_.extend($, {
    /**
     * @constructor
     * @method construct
     * @param {Object} config Controller configuration
     */
    construct: function(config) {
        var guideDetailsSourceData = require('data/guide').guideDetails[config.guideIndex];
        buildPage(guideDetailsSourceData);
        $._guideHeading = guideDetailsSourceData[0].heading;

        // Open the window in dialog if the window is requested from other than the guide
        if (config.dialog) {
            if (OS_IOS) {
                $.backButton.hide();
                $.closeButton.show();
            }
            WM.openModal($.getView(), { title: $._guideHeading });
        }
    },

    getGuideHeading: function () {
        return $._guideHeading;
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
    $.getView().close({ animated : true });
}

/**
 * @method buildPage
 * @param  {Array} guideDetailData Array of objects containing the data of the guide details page
 */
function buildPage (guideDetailData) {
    _.each(guideDetailData, function (content) {
        var guideDetailType = _.keys(content);
        if (guideDetailType[0] === 'video') {
            var videoPlayer = Titanium.Media.createVideoPlayer({
                url: content[guideDetailType[0]],
                autoplay : false,
                height : 200,
                top: 10,
                bottom: 10,
                mediaControlStyle : Titanium.Media.VIDEO_CONTROL_DEFAULT,
                scalingMode : Titanium.Media.VIDEO_SCALING_ASPECT_FIT
            });

            $.paddingContainer.add(videoPlayer);
            return;
        }


        if (guideDetailType[0] === 'heading') {
            if (OS_IOS) {
                $.headerTitle.text = content[guideDetailType[0]];
            }
            return;
        }

        var label = $.UI.create('Label', {
            text: content[guideDetailType[0]],
            classes: guideDetailType
        });

        $.paddingContainer.add(label);
    });
}
