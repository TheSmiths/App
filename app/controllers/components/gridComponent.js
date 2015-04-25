var args = arguments[0] || {};
var dataObject;

if (args.gridComponentData) {
    console.log('Generating component');
    dataObject = args.gridComponentData;

    $.icon.image = dataObject.icon;
    $.value.text = dataObject.valueLabel;
    $.caption.text = dataObject.captionLabel;
    $.gridIconContainer.componentId = args.gridComponentData.id;
    $.gridContainer.componentId = args.gridComponentData.id;
    $.icon.componentId = args.gridComponentData.id;
    $.value.componentId = args.gridComponentData.id;
    $.caption.componentId = args.gridComponentData.id;
}

/**
 * [onClickGrid description]
 * @param  {[type]} evt [description]
 * @return {[type]}     [description]
 */
function onClickGrid (evt) {
    console.log(evt);
    $.trigger('click', evt);
}
