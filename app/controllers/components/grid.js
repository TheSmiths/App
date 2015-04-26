var args = arguments[0] || {};

/**
 * @method setData
 * Set data of the grid
 * @param {Array} data Array of objects
 */
function setData (data) {
    if (data.length <= 0) {
        log.info('[Grid] No data provided, please provide grid data');
        return;
    }

    var counter = 0;
    var row;

    _.each(data, function (dataObject, key) {
        counter++;

        var even = counter % 2;
        if (even) {
            row = Titanium.UI.createView({
                top: 0,
                layout: 'horizontal',
                height: 100,
                bottom: 20,
            });
        }

        var gridComponent = Alloy.createController('components/gridComponent', {gridComponentData: dataObject}).getView();
        gridComponent.addEventListener('click', onClickGridComponent);
        row.add(gridComponent);

        if (!even || key + 1 === data.length) {
            $.grid.add(row);
            row = false;
        }
    });

}

/**
 * @method onClickGridComponent
 * @param  {Object} evt
 */
function onClickGridComponent (evt) {
    $.trigger('click', evt);
}

// Export set data
exports.setData = setData;
