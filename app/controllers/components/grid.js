var args = arguments[0] || {};

var rows = 0;

function setData (data) {
    if (data.length <= 0) {
        log.info('[Grid] No data provided');
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

function onClickGridComponent (evt) {
    $.trigger('click', evt);
}

exports.setData = setData;
