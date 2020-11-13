import 'materialize-css/dist/css/materialize.css';

FlowRouter.route('/', {
  name:"main",
  action:function(){
    BlazeLayout.render('main');
  }
});

FlowRouter.route('/camera', {
  name:"camera",
  action:function(){
    BlazeLayout.render('mainLayout', {area:"camera"});
  }
});

FlowRouter.route('/viewer', {
  name:"viewer",
  action:function(){
    BlazeLayout.render('viewer');
  }
});
