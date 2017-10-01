const request = require('request');
const logger = require('sp-json-logger');
const util = require('./commonUtils');

module.exports.createJob = (jobConfig, client) => {
  return new Promise((resolve, reject) => {
    request.post({
      url: `${client.instance_url}/services/async/${process.env.API_VERSION}/job`,
      headers: util.generateHeaders(client),
      body: jobConfig,
    },
        (err, res) => {
          if (err) {
            logger.tag('JOB CREATE').error({err: err});
            return reject({source: 'createJob()', error: err});
          }
          resolve(res);
        });
  });
};

module.exports.getJobDetails = (jobId, client) => {
  return new Promise((resolve, reject) => {
    request.get({
      url: `${client.instance_url}/services/async/${process.env.API_VERSION}/job/${jobId}`,
      headers: util.generateHeaders(client),
    },
    (err, res) => {
      if (err) {
        logger.tag('JOB DETAILS').error({err: err});
        return reject({source: 'getJobDetails()', error: err});
      }
      resolve(res);
    });
  });
};

module.exports.getJobBatches = (jobId, client) => {
  return new Promise((resolve, reject) => {
    request.get({
      url: `${client.instance_url}/services/async/${process.env.API_VERSION}/job/${jobId}/batch`,
      headers: util.generateHeaders(client),
    },
      (err, res) => {
        if (err) {
          logger.tag('JOB DETAILS').error({err: err});
          return reject({source: 'getJobDetails()', error: err});
        }
        resolve(res);
      });
  });
};

module.exports.closeJob = (jobId, client) => {
  return new Promise((resolve, reject) => {
    request.post({
      url: `${client.instance_url}/services/async/${process.env.API_VERSION}/job/${jobId}`,
      headers: util.generateHeaders(client),
      body: {state: 'Closed'},
    },
    (err, res) => {
      if (err) {
        logger.tag('JOB CLOSE').error({err: err});
        return reject({source: 'closeJob()', error: err});
      }
      resolve(res);
    });
  });
};

module.exports.abortJob = (jobId, client) => {
  return new Promise((resolve, reject) => {
    request.post({
      url: `${client.instance_url}/services/async/${process.env.API_VERSION}/job/${jobId}`,
      headers: util.generateHeaders(client),
      body: {state: 'Aborted'},
    },
    (err, res) => {
      if (err) {
        logger.tag('JOB ABORT').error({err: err});
        return reject({source: 'abortJob()', error: err});
      }
      resolve(res);
    });
  });
};

/**
 * ###########################  BATCHES  ##############################
 */

module.exports.createBatch = (jobId, client, query) => {
  return new Promise((resolve, reject) => {
    request.post({
      url: `${client.instance_url}/services/async/${process.env.API_VERSION}/job/${jobId}/batch`,
      headers: util.generateHeaders(client),
      body: query,
    },
    (err, res) => {
      if (err) {
        logger.tag('CREATE BATCH').debug({err: err});
        return reject({source: 'createBatch()', error: err});
      }
    });
  });
};

module.exports.getBatchInfo = (jobId, batchId, client) => {
  return new Promise((resolve, reject) => {
    request.get({
      url: `${client.instance_url}/services/async/${process.env.API_VERSION}/job/${jobId}/batch/${batchId}`,
      headers: util.generateHeaders(client),
      body: 'Your plain text query here...',
    },
        (err, res) => {
          if (err) {
            logger.tag('CREATE BATCH').debug({err: err});
            return reject({source: 'createBatch()', error: err});
          }
          resolve(res);
        });
  });
};

module.exports.getBatchResult = (jobId, batchId, client) => {
  return new Promise((resolve, reject) => {
    request.get({
      url: `${client.instance_url}/services/async/${process.env.API_VERSION}/job/${jobId}/batch/${batchId}/result`,
      headers: util.generateHeaders(client),
      body: 'Your plain text query here...',
    },
      (err, res) => {
        if (err) {
          logger.tag('CREATE BATCH').debug({err: err});
          return reject({source: 'createBatch()', error: err});
        }
        resolve(res);
      });
  });
};

module.exports.BATCH_COMPLETED = 'BATCH_COMPLETED';
module.exports.STOP_POLLING = 'STOP_POLLING';
