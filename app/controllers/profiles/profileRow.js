var args = arguments[0] || {};
var model =  args.model;

$.user.text = model.get('name');

var userInfo = 'Platform height: ' + model.get('height') + 'm, Surveys: ' + model.get('surveys');

$.profileRow.modelId = model.get('id');

$.userInfo.text = userInfo;

if (args.state === 'SURVEY') {
    $.deleteUser.visible = false;
}

function onClickDeleteUser (evt) {
    evt.model = model;
    $.trigger('click', evt);
}
