'use strict';
const request = require('request');

module.exports = function enableAuthentication(server) {
  var router = server.loopback.Router();

  router.get('/callback', function(req, res, next) {
        // here we receive oauth code, use it to obtain access_token

    if (req.query.code) {
      console.log('fetching access_token...');
      handleOauthCallback(req, (err, success) => {
        if (err) return res.status(400).json(err);
        console.log('redirecting');
        res.redirect('https://localhost:3000/explorer/#!/OauthUsers/OauthUsers_find');
      });
    } else {
      res.json({message: 'no code', err: req.query.error || ''});
    }
        // res.json(req.query);
  });
  router.get('/sf', function(req, res, next) {
    res.redirect(`${process.env.SF_AUTHORIZE_URL}?response_type=code&client_id=${process.env.consumer_key}&redirect_uri=${process.env.redirect_url}`);
  });

  server.use(router);
};

/**
 *
 * @param {*request object required to access model and query code} req
 * @param {*callback method, returns new created/upserted user} cb
 */
let handleOauthCallback = (req, cb) => {
  request.post(`${process.env.SF_ACCESS_TOKEN_REQUEST}?code=${req.query.code}&grant_type=${process.env.grant_type}&client_id=${process.env.consumer_key}&client_secret=${process.env.client_secret}&redirect_uri=${process.env.redirect_url}&format=json`,
    function(err, httpResponse, body) {
      if (err) return cb({message: 'access token error', error: err});
      console.log('access token fetched');
      const result = JSON.parse(body);
      result.loginId = result.id;
      req.app.models.OauthUsers.findOrCreate({where: {loginId: result.loginId}}, result, (err, user) => {
        if (err) return cb({message: 'database error', error: err});
        return cb(null, {message: 'User created', user: user});
      });
    });
}
  ;
