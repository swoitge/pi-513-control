import M from 'materialize-css';

Template.viewer.onCreated(function() {
  var template = this;
  template.orientation = new ReactiveVar({a:0, b:0, c:0});
  template.trackingEnabled = new ReactiveVar(true);
  template.menuVisible = new ReactiveVar(true);
});

Template.viewer.onRendered(function() {

  $('.dropdown-trigger').dropdown();


  var template = this;
  window.addEventListener("deviceorientation", function(event){
    //alert("deviceorientation");
    var val = {
      a: Math.round(event.alpha),
      b: Math.round(event.beta),
      c: Math.round(event.gamma)
    };
    template.orientation.set(val);
    Meteor.call("setViewerOrientation", val);
    //console.log("handle device event", event.alpha, event.beta, event.gamma);
  }, true);
});

Template.viewer.helpers({
  streamURL : function(){
    return Meteor.settings.public.mjpegStreamBase;
  },
  orientation : function(){
    return Template.instance().orientation.get();
  },
  menuVisible : function(){
    return Template.instance().menuVisible.get();
  },
  trackingEnabled : function(){
    return Template.instance().trackingEnabled.get();
  },
  disabledState : function(){
    return Template.instance().trackingEnabled.get() ? {checked:true} : {};
  }
});

Template.viewer.events({
  "change input.enable-tracking" : function(event, template){
    console.log("enabled tracking", event.target.checked);
     template.trackingEnabled.set(event.target.checked);
  },
  "click .live-image":function(event, template){
    console.log("click")
    var visible = template.menuVisible.get()
    template.menuVisible.set(!visible);
  }
});
