'use strict';

module.exports.generateHeaders = (client) => {
  let headers = {
    'content-type': 'application/json',
    'Authorization': `Bearer ${client.access_token}`,
  };
  return headers;
};