'use strict';

module.exports.generateHeaders = (client) => {
  let headers = {
    'content-type': 'application/json',
    'Authorization': `Bearer ${client.access_token}`,
    'Sforce-Enable-PKChunking': `chunkSize=${client.chunkSize || 1000}; startRow=00130000000xEftMGH`
  };
  return headers;
};