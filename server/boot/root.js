'use strict';

const request = require('request');

module.exports = function(server) {
  // Install a `/` route that returns server status
  var router = server.loopback.Router();
  router.get('/', server.loopback.status());
  router.get('/callback', function(req, res, next) {
    // here we receive oauth code, use it to obtain access_token
    if (req.query.code) {
      console.log('fetching access_token...');
      request.post(`${process.env.SF_ACCESS_TOKEN_REQUEST}?code=${req.query.code}&grant_type=${process.env.grant_type}&client_id=${process.env.consumer_key}&client_secret=${process.env.client_secret}&redirect_uri=${process.env.redirect_url}&format=json`,
      function(err, httpResponse, body) {
        if (err) return res.json(err);
        console.log('access token fetched');
        const result = JSON.parse(body);
        req.app.models.OauthUsers.create(result, (err, user) => {
          if (err) return res.status(400).json({error: err});
          return res.json({body: user});
        });
      });
      
    } else {
      res.json({message: 'no code'}); 
    }
    // res.json(req.query);
  });
  router.get('/sf', function(req, res, next) {
    res.redirect(`${process.env.SF_AUTHORIZE_URL}?response_type=code&client_id=${process.env.consumer_key}&redirect_uri=${process.env.redirect_url}`);
  });
  server.use(router);
};
