if(typeof api == "undefined") api = {};

api.rest = api.rest || {};

var restBaseURL = "/api/videodev/settings";

api.rest.zoom = function(zoom) {
  CONTROL.current_value = zoom;
  var payload = getControlCall(CONTROL);
  api.rest.call(payload);
}

api.rest.call = function(payload){
  $.ajax({
    type        : 'PUT',
    url         : restBaseURL,
    contentType : 'application/json',
    data        : JSON.stringify(payload), // access in body
  }).done(function () {
      console.log('SUCCESS');
  }).fail(function (msg) {
      console.log('FAIL');
  });
}

var CONTROL = {
   "current_value": 1,
   "default_value": 0,
   "flags": 0,
   "id": 134217729,
   "max": 8,
   "min": 1,
   "name": "zoom factor",
   "options": [],
   "step": 1,
   "type": "integer"
};

function getControlCall(control){
  return {
   "apply_settings_only_if_changed": true,
   "controls": [control]
 };
};
