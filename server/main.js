import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  // code to run on server at startup
  Meteor.settings.public.mjpegStreamBase = process.env.STREAM_BASE;
});
