import { Meteor } from 'meteor/meteor';

var range = 1024;       /* LEDs can quickly hit max brightness, so only use */
var clockdiv = 128;       /* Clock divider (PWM refresh rate), 8 == 2.4MHz */

var SERVOS = {
  12: {min:180, max:400},
  35: {min:180, max:400}
}

var rpio;

try {
  rpio = Npm.require('rpio');

  rpio.pwmSetClockDivider(clockdiv);

  // pin12
  rpio.open(12, rpio.PWM);
  rpio.pwmSetRange(12, range);
  console.log("initialized rpio");
}
catch(e){
  rpio = {pwmSetData : function(pin,pwm){console.log("pwmSetData mock", pin, pwm);}};
  console.log("failed initializing rpio, using mock");
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
    rpio.pwmSetData(pin, value);
  },
})
