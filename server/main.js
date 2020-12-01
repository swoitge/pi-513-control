import { Meteor } from 'meteor/meteor';

var SERVOS = {
  18: {min:500, max:2500, deg90:2400}
}

var rpio;

var currentView = {a:0, b:0, c:0};
var currentOffset = {a:0, b:0, c:0};

try {

  var Gpio = Npm.require('pigpio').Gpio;

  SERVOS[18].gpio = new Gpio(18, {mode: Gpio.OUTPUT});
}
catch(e){
  SERVOS[18].gpio = {servoWrite : function(pin,pwm){console.log("servoWrite mock", pin, pwm);}};
  console.log("failed initializing pigpio, using mock");
}

Meteor.startup(() => {
  // code to run on server at startup
  Meteor.settings.public.mjpegStreamBase = process.env.STREAM_BASE;

  Meteor.methods({
    setOffset : function(values){
      currentOffset = values;
    },
    setViewerOrientation : function(values){
      currentView = values;

      // heading
      var targetDeg = currentView.a - currentOffset.a - 90;
      if(targetDeg < 90 && targetDeg > -90) {
        api.servo.setDegree(18, targetDeg);
      }
    },
    setServoPWM          : api.servo.setPWM,
    setServoDegree       : api.servo.setDegree
  });
});

if(typeof api == "undefined") api = {};
api.servo = api.servo || {};

api.servo.setDegree = function(pin, degree){
  // get config
  var conf = SERVOS[pin];
  if(!conf) {
    console.log("no servo config found for pin", pin);
    return;
  }

  // degree to pwm
  var pwmZero = (conf.max - conf.min) / 2 + conf.min;       // pwm of zero
  var factor = (conf.deg90 - pwmZero) / 90;                 // factor pwm per degree
  var pwm = pwmZero + degree * factor;                      // target pwm

  api.servo.setPWM(pin, pwm, true);
};

api.servo.setPWM = function(pin, pwm, checkBounds){

  // get config
  var conf = SERVOS[pin];
  if(!conf) {
    console.log("no servo config found for pin", pin);
    return;
  }

  // check bounds
  var value = pwm;

  if(checkBounds) {
    value = Math.max(conf.min, value);
    value = Math.min(conf.max, value);
  }

  // set
  conf.gpio.servoWrite(value);
};
