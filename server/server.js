'use strict';
var https = require('https');
var http = require('http');
var sslConfig = require('./ssl-config');
var loopback = require('loopback');
var boot = require('loopback-boot');

var app = module.exports = loopback();

var options = {
  key: sslConfig.privateKey,
  cert: sslConfig.certificate,
};
var httpOnly = false;

app.start = function() {
  // start the web server
  // return app.listen(function() {
  //   app.emit('started');
  //   var baseUrl = app.get('url').replace(/\/$/, '');
  //   console.log('Web server listening at: %s', baseUrl);
  //   if (app.get('loopback-component-explorer')) {
  //     var explorerPath = app.get('loopback-component-explorer').mountPath;
  //     console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
  //   }
  // });
  var server = null;
  if (httpOnly === false) {
    server = https.createServer(options, app);
  } else {
    server = http.createServer(app);
  }
  return server.listen(app.get('port'), function() {
    var baseUrl = (httpOnly ? 'http://' : 'https://') + app.get('host') + ':' + app.get('port');
    app.emit('started', baseUrl);
    console.log('LoopBack server listening @ %s%s', baseUrl, '/');
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});
