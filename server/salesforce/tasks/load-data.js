const logger = require('sp-json-logger');
const util = require('../utils/buklApiUtils');
/**
 * @param:clientConfig contains client specific config like instance-name and access_token for making api calls
 */
module.exports = function loadData(clientConfig, object) {
  let jobConfig = {operation: 'query', object: object, contentType: 'json'};
  util.createJob(jobConfig, clientConfig)
    .then((job) => {
      logger.tag('JOB CREATED').debug({log: {job: job}});
      // logic to create batches and wait for them to complete! Retrieve results once batch finishes and close the job
    })
    .catch((err) => {
      logger.tag('JOB CREATION').error({err: err});
    });
};

