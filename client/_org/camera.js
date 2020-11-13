Template.serverView.onCreated(function helloOnCreated() {

  var template = this;

  template.orientation = new ReactiveVar({a:0, b:0, c:0});
  template.orientationAdjust = new ReactiveVar({a:0, b:0, c:0});

  Streamy.on("orientation", function(data){
    //console.log("received orientation per streamy", data);
    template.orientation.set(data);
  });
});

Template.serverView.helpers({
  heading : function(){
    var ti = Template.instance();
    var orientation = ti.orientation.get();
    var orientationAdjust = ti.orientationAdjust.get();

    return - 90 - orientation.a + orientationAdjust.a ;
  },
  orientation : function(){
    return Template.instance().orientation.get();
  },
  orientationAdjust : function(){
    return Template.instance().orientationAdjust.get();
  }
});

Template.serverView.events({
  "click button.reset.axis-a" : function(){
    var value = Template.instance().orientation.get();
    var adj = Template.instance().orientationAdjust.get();
    adj.a = parseInt(jQuery(event.target).text());
    Template.instance().orientationAdjust.set(adj);
  },
  "click button.reset.axis-b" : function(){
    var value = Template.instance().orientation.get();
    var adj = Template.instance().orientationAdjust.get();
    adj.b = parseInt(jQuery(event.target).text());
    Template.instance().orientationAdjust.set(adj);
  },
  "click button.reset.axis-c" : function(){
    var value = Template.instance().orientation.get();
    var adj = Template.instance().orientationAdjust.get();
    adj.c = parseInt(jQuery(event.target).text());
    Template.instance().orientationAdjust.set(adj);
  },
  orientationAdjust : function(){
    return Template.instance().orientationAdjust.get();
  }
});
