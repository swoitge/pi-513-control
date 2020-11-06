const P2J = require('pipe2jpeg');
const http = require('http');
const WebSocket = require('ws');
const fs = require('fs');


const spawn = require('child_process').spawn;

var BASE_HTML = "./html";

const params = [
    /* log info to console */
    '-loglevel',
    'quiet',

    /* use an artificial video input */
    "-f",  "dshow",
    "-i", "video=USB2.0 Camera",

    /* set output flags */
    '-an',
    '-c:v',
    'mjpeg',
    '-pix_fmt',
    'yuvj422p',
    '-f',
    'image2pipe',//image2pipe, singlejpeg, mjpeg, or mpjpeg
    '-vf',
    'fps=10',
    '-q',
    '1',
    /*'-frames',
    '100',*/
    'pipe:1'
];

const p2j = new P2J();
var currentJpeg;

p2j.on('jpeg', (jpeg) => {
  //console.log('received jpeg', ++jpegCounter);
  currentJpeg = jpeg;
});

const ffmpeg = spawn('ffmpeg', params, {stdio : ['ignore', 'pipe', 'ignore']});

ffmpeg.on('error', (error) => {
    console.log(error);
});

ffmpeg.on('exit', (code, signal) => {
    console.log('exit', code, signal);
});

ffmpeg.stdout.pipe(p2j);

var server = http.createServer(function(req, res) {
  console.log("on request", req.url);
  var fileContent = "";

  var contentType = "text/html";
  if(req.url.endsWith(".jpg")) {
    contentType = "image/jpeg";
    fileContent = currentJpeg;
  }

  if(fs.existsSync(BASE_HTML + req.url)) {
    // read file
    fileContent = fs.readFileSync(BASE_HTML + req.url);
    var contentType = "text/html";
    if(req.url.endsWith(".js")) {
      contentType = "text/javascript";
    }
  }

  res.writeHead(200, {
    'Access-Control-Allow-Origin': '*',
    'Content-Type'               : contentType,
  });
  res.write(fileContent);
  res.end();
}).listen(8080);

const wss = new WebSocket.Server({ server });

var methodsHandler = {};
function provideMethod(name, func) {
  methodsHandler[name] = function(msgObj, ws){
    var retval = func.apply({}, msgObj.args);
    if(msgObj.callback) {
      ws.send(JSON.stringify({
        messageId : msgObj.messageId,
        result    : retval})
      );
    }
  }
}

provideMethod("getCurrentImage", function(){
  return currentJpeg;
});

wss.on('connection', function (ws) {
  console.log("wss on connection");
  ws.on('message', function(message) {
    console.log("wss on message", message);
    var msgObj = JSON.parse(message);

    if(msgObj) {

      // check handler
      var handler = methodsHandler[msgObj.method];
      if(handler) {
        handler(msgObj, ws);
      }
      else {
        console.log("no handler found for method", msgObj.method);
      }
    }
  });
});
