const request = require('request');
const logger = require('sp-json-logger');

module.exports = function createJob(jobConfig, clientConfig) {
  return new Promise((resolve, reject) => {
    request.post(process.env.SF_CREATE_JOB_URL, {form: {operation: args.operation, object: args.object, contentType: args.contentType}}, (err, res) => {
      if (err) {
        logger.tag('JOB CREATE').error({err: err});
        return reject({source: 'createJob()', error: err});
      }
      resolve(res);
    });
  });
};

module.exports = function getJobDetails(jobId, clientConfig) {
  return new Promise((resolve, reject) => {
    request.get(process.env.SF_JOB_DETAILS_URL, (err, res) => {
      if (err) {
        logger.tag('JOB DETAILS').error({err: err});
        return reject({source: 'getJobDetails()', error: err});
      }
      resolve(res);
    });
  });
};

module.exports = function closeJob(jobId, clientConfig) {
  return new Promise((resolve, reject) => {
    request.post(process.env.SF_CLOSE_JOB_URL, {form: {state: 'Closed'}}, (err, res) => {
      if (err) {
        logger.tag('JOB CLOSE').error({err: err});
        return reject({source: 'closeJob()', error: err});
      }
      resolve(null, res);
    });
  });
};

module.exports = function abortJob(jobId, clientConfig) {
  return new Promise((resolve, reject) => {
    request.post(process.env.SF_ABORT_JOB_URL, {form: {state: 'Aborted'}}, (err, res) => {
      if (err) {
        logger.tag('JOB ABORT').error({err: err});
        return reject({source: 'abortJob()', error: err});
      }
      resolve(res);
    });
  });
};
