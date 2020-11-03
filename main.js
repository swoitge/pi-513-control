  const fs = require('fs');
  const http = require('http');
  const {spawn} = require('child_process');

  const dataLog = function(data){console.log(data.toString());};
  var BASE = "d:\\temp\\webm_live";
  var BASE_HTML = "./html";

  console.log("start raspistill");
  const isWindows = process.platform == "win32";

  var codec = "libvpx";
  var raspivid;
  if(!isWindows) {
    BASE      = "/home/pi/webm_live";
    BASE_HTML = "/home/pi/pi-513-control/html";
    codec     = "libvpx";               // non windows: Codex VP8
    raspivid  = spawn("raspivid",[
      "-o", "-",
      "-t", "0",
      "-w","1280",
      "-h", "720",
      "-fps", "25"]);
  }

  const ffmpeg = spawn('ffmpeg',
  [//"-r", "25",
   //"-re",
   //"-i", "pipe:0",
    "-f",  "dshow",  "-i", "video=USB2.0 Camera",
    //"-y", "-an",
    "-map", "0:0",
    "-c:v", codec,
    "-s", "1280x720",
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
    "-error-resilient", "1",
    "-b:v", "500k",
    "-f", "webm_chunk",
    "-header", BASE + "/glass_360.hdr",
    "-window_size", "10",
    "-chunk_start_index", "1",
    BASE + "/glass_360_%d.chk"]);

  ffmpeg.stdout.on("data", dataLog);
  ffmpeg.stderr.on("data", dataLog);

  setTimeout(function(){
    const ffmpeg_head = spawn("ffmpeg",[
      "-y",
      "-f", "webm_dash_manifest",
      "-live", "1",
      "-i", BASE + "/glass_360.hdr",

      //"-f", "webm_dash_manifest",
      //"-live", "1",
      //"-i", BASE + "/glass_171.hdr",
      "-c", "copy",
      "-map", "0",
      //"-map", "1",

      "-f", "webm_dash_manifest",
      "-live", "1",
      //"-adaptation_sets", "id=0,streams=0 id=1,streams=1",
      "-adaptation_sets", "id=0,streams=0",
      "-chunk_start_index", "1",
      "-chunk_duration_ms", "2000",
      "-time_shift_buffer_depth", "7200",
      "-minimum_update_period", "7200",
      BASE + "/glass_live_manifest.mpd"
    ]);
    ffmpeg_head.stdout.on("data", dataLog);
    ffmpeg_head.stderr.on("data", dataLog);
  }, 10000);

  if(raspivid) {
    raspivid.stdout.pipe(ffmpeg.stdin);
    raspivid.on("exit", function(code){
      console.log(`raspivid exited with code ${code}`);
    });
  }

  ffmpeg.on("exit", function(code){
    console.log(`ffmpeg exited with code ${code}`);
  });

  // Create VIDEO server
  http.createServer(function(req, res) {
    console.log("on request", req.url);

    if(!fs.existsSync(BASE + req.url)) {
      res.writeHead(404);
      res.end();
      return;
    }

    // read file
    const fileContent = fs.readFileSync(BASE + req.url);

    var contentType = "text/html";
    if(req.url.endsWith(".mpd")) {
      contentType = "application/dash+xml";
    }

    if(req.url.endsWith(".chk")) {
      contentType = "video/mp4";
    }

    res.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Content-Type'               : contentType,
    });
    res.write(fileContent);
    res.end();
  }).listen(8080);

  // Create HTML server
  http.createServer(function(req, res) {
    console.log("on request", req.url);

    if(!fs.existsSync(BASE_HTML + req.url)) {
      res.writeHead(404);
      res.end();
      return;
    }

    // read file
    const fileContent = fs.readFileSync(BASE_HTML + req.url);

    var contentType = "text/html";
    if(req.url.endsWith(".js")) {
      contentType = "text/javascript";
    }

    res.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Content-Type'               : contentType,
    });
    res.write(fileContent);
    res.end();
  }).listen(8081);
