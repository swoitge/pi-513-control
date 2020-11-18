//var fs          = Npm.require("fs");
var os          = Npm.require("os");
//var http        = Npm.require("http");
var https       = Npm.require("https");
//var Base64      = Npm.require("js-base64").Base64;
var httpProxy   = Npm.require("http-proxy");
var createCert  = Npm.require('create-cert');

Meteor.startup(function(){
  // create STREAM proxy object
  var streamProxy = new httpProxy.createProxyServer({
    target          : process.env.STREAM_BASE/*,
    proxyTimeout    : 10000,
    protocolRewrite : "https"*/
  });
  streamProxy.on('proxyReq', function(proxyReq, req, res, options) {
    console.log("on proxy request");
  });

  // create the proxy object
  var proxy = new httpProxy.createProxyServer({
    target          : process.env.ROOT_URL,
    proxyTimeout    : 10000,
    protocolRewrite : "https"
  });

  // X-Forwarded-Proto = https
  proxy.on('proxyReq', function(proxyReq, req, res, options) {
    try {
      proxyReq.setHeader("x-forwarded-proto", "https");
      //proxyReq.setHeader("x-forwarded-host", requestDomain);
      if(req.connection.remoteAddress) {
        proxyReq.setHeader('x-forwarded-for', req.connection.remoteAddress);
      }
      else{
        console.log("warning: connection without remote address", req.originalUrl);
      }
    }
    catch(e) {
      console.log("exception on proxy request", e);
    }
  });

  // Listen for the `error` event on `proxy`.
  proxy.on('error', function (err, req, res) {
    console.error("error proxying", err, req.url);

    // TypeError: res.writeHead is not a function at ProxyServer.<anonymous> (server/main.js:228:9) at ProxyServer.emit
    //res.writeHead(500, {"Content-Type": "text/plain"});
    res.setHeader("Content-Type", "text/plain");
    res.statusCode = 503;
    res.end('error');
  });

  //var content = fs.readFileSync("D:\\privat\\3d-live-video\\65718995_localhost.cert");
  //console.log(content);

  //console.log(process.cwd());
  /*
  var options = {
    cert  : fs.readFileSync("D:\\privat\\3d-live-video\\65718995_localhost.cert"),
    key   : fs.readFileSync("D:\\privat\\3d-live-video\\65718995_localhost.key")
  };
  */
  var hostname = os.hostname();
  var options = {
    days      : 365,
    commonName: hostname
  };

  createCert(options).then(function(keys){
    console.log("certificate generated for", hostname);
    var server = https.createServer(keys, function (request, response) {
      console.log("request", request.url);

      if(request.url.startsWith("/stream") || request.url.startsWith("/api")) {
        streamProxy.web(request, response);
      }

      //var remoteIP = request.connection.remoteAddress.replace("::ffff:", "");
      else {
        // request timeouts
        proxy.web(request, response);
      }
      //return;
    });

    server.on('upgrade', function(req, socket, head) {
      //console.log('upgrade ');
      var timeout = 24 * 60 * 60 * 1000;
      //var proxy = getProxy(req, null, 10000);
      proxy.ws(req, socket, head);
    });

    server.listen(8443);
    console.log("---------------------listen on 8443");
  });

});
