  const http = require('http');
  const {spawn} = require('child_process');

  const dataLog = function(data){console.log(data);};
  const BASE = "/home/pi/webm_live";

  console.log("start raspistill");
  const raspivid = spawn("raspivid",[
    "-o", "-",
    "-t", "0",
    "-w","1280",
    "-h", "720",
    "-fps", "25"]);

  const ffmpeg = spawn('ffmpeg',
  ["-r", "25",
   "-re",
   "-i", "pipe:0",
    "-y", "-an",
    "-map", "0:0",
    "-c:v", "libvpx",
    "-s" "1280x720",
    "-keyint_min", "60",
    "-g", "60",
    "-speed", "6",
    "-tile-columns", "4",
    "-frame-parallel", "1",
    "-threads", "8",
    "-static-thresh", "0",
    "-max-intra-rate", "300",
    "-deadline", "realtime",
    "-lag-in-frames", "0",
    "-error-resilient", "1", "-b:v", "3000k",
    "-f" "webm_chunk",
    "-header", BASE + "/glass_360.hdr",
    "-chunk_start_index", "1", BASE + "/glass_360_%d.chk"]);

  raspivid.stdout.pipe(ffmpeg.stdin);

  raspivid.on("exit", function(code){
    console.log(`raspivid exited with code ${code}`);
  });
  ffmpeg.on("exit", function(code){
    console.log(`ffmpeg exited with code ${code}`);
  });

  // Create server
  var server = http.createServer(function onRequest (req, res) {
    console.log("on request", req.url);
    serve(req, res, finalhandler(req, res));
  });

  // Listen
  server.listen(8080);
