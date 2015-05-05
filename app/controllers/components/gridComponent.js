var args = arguments[0] || {};


_.extend($, {
    /**
     * @constructor
     * @method construct
     * @param {Object} config Controller configuration
     */
    construct: function(config) {
        var dataObject = config.gridComponentData;
        // Set grid data on creation
        if (!dataObject) {
            return;
        }

        // Populate the view using the data
        $.icon.image = dataObject.icon;
        $.value.text = dataObject.valueLabel;
        $.caption.text = dataObject.captionLabel;
        $.gridIconContainer.componentId = dataObject.id;
        $.gridContainer.componentId = dataObject.id;
        $.icon.componentId = dataObject.id;
        $.value.componentId = dataObject.id;
        $.caption.componentId = dataObject.id;
    },

    /**
     * @method destruct
     * function executed when closing window
     */
    destruct: function() {
    }
});

/**
 * @method onClickGrid
 * Proxy click on gridComponent
 * @param  {Object} evt
 */
function onClickGrid (evt) {
    $.trigger('click', evt);
}
