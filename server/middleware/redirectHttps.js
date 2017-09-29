'use-strict';

module.exports = function() {
  return function myMiddleware(req, res, next) {
      // ...
    console.log('middleware hit');
    if (!req.secure) {
      var port = req.get('port');
      var host = req.get('host');
      console.log('redirecting to https');
      return res.redirect('https://' + host + ':' + port + req.url);
    }
    next();
  };
};
