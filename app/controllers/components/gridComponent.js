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

        if (dataObject.type === 'large'){
            $.gridContainer.width = Ti.UI.FILL;
            $.gridIconContainer.width = '100%';
        }

        if (!dataObject.captionLabel) {
            $.value.top = 37;
        }

        // Populate the view using the data
        $.value.text = dataObject.valueLabel;
        $.caption.text = dataObject.captionLabel;
        $.gridIconContainer.componentId = dataObject.id;
        $.gridContainer.componentId = dataObject.id;
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
