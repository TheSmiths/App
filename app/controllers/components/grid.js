var args = arguments[0] || {};

/**
 * @method setData
 * Set data of the grid
 * @TODO: Could use a refactor / better approach
 * @param {Array} data Array of objects
 */
function setData (data) {
    if (!data || data.length <= 0) {
        log.info('[Grid] No data provided, please provide grid data');
        return;
    }

    // Internals
    var counter = 0;
    var row;
    var largeItem = false;
    var evenMode = true;


    //Loop over data
    _.each(data, function (dataObject, key) {
        counter++;

        var even = counter % 2;
        if (evenMode && even || !evenMode && !even) {
            row = Titanium.UI.createView({
                top: 0,
                layout: 'horizontal',
                height: 100,
                bottom: 0
            });

        }
        var gridComponent = Alloy.createController('components/gridComponent', {gridComponentData: dataObject}).getView();
        gridComponent.addEventListener('click', onClickGridComponent);
        row.add(gridComponent);

        // Flip mode
        if (dataObject.type === 'large') {
            evenMode = evenMode ? false : true;
        }

        if (!even && evenMode || even && !evenMode || key + 1 === data.length) {
            $.grid.add(row);
            row = false;
        }
    });

}

/**
 * @method onClickGridComponent
 * @param {Object} evt
 */
function onClickGridComponent (evt) {
    $.trigger('click', evt);
}

// Export set data
exports.setData = setData;
