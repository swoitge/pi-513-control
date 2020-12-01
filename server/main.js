import { Meteor } from 'meteor/meteor';

var SERVOS = {
  18: {min:1000, max:2000}
}

var rpio;

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
});

Meteor.methods({
  setViewerOrientation : function(){},
  setServo : function(pin, pwm){

    // get config
    var conf = SERVOS[pin];
    if(!conf) {
      console.log("no servo config found for pin", pin);
      return;
    }

    // check bounds
    var value = pwm;

    value = Math.max(conf.min, value);
    value = Math.min(conf.max, value);

    // set
    conf.gpio.servoWrite(value);
  },
})
