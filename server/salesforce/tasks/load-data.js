const logger = require('sp-json-logger');
const util = require('../utils/bulkApiUtil');
var EventEmitter = require('events').EventEmitter;

/**
 * @param:clientConfig contains client specific config like instance-name and access_token for making api calls
 */
module.exports.loadData = (clientConfig, args) => {
  let jobConfig = {operation: 'query', object: args.object, contentType: 'json'};
  util.createJob(jobConfig, clientConfig)
    .then((job) => {
      logger.tag('JOB CREATED').debug({log: {job: job}});
      // logic to create batches and wait for them to complete! Retrieve results once batch finishes and close the job
      // processBatches(job.id, clientConfig, args.query);
      return util.createBatch(job.id, clientConfig, args.query); // if using pk chunking, automatically multiple batches will be created by salesforce!
    })
    .then((batch) => {
      logger.tag('BATCH CREATED').debug({log: {batch: batch}});
      pollBatches(batch.jobId, clientConfig);
    })
    .catch((err) => {
      logger.tag('JOB CREATION').error({err: err});
    });
};

// let processBatches = (jobId, clientConfig, query) => {
//   util.createBatch(jobId, clientConfig, query)
//   .then((batch) => {
//     logger.tag('BATCH CREATED').debug({log: {batch: batch}});
//     pollBatches(jobId, clientConfig);
//   })
//   .catch((err) => {
//     logger.tag('BATCH CREATION').error({err: err});
//   });
// };

let pollBatches = (jobId, clientConfig) => {
  let completedBatchIds = [];
  let emitter = createEventEmitter([util.BATCH_COMPLETED, util.STOP_POLLING]);
  // poll for completed batches, if not already in processBatchIds. We do not process batches which are already in completedBatchIds array!
  var timerId = setInterval(() => {
    fetchBatchesForJob(jobId, clientConfig, completedBatchIds, emitter, timerId);
  }, 2000); // polling every two seconds
};

let fetchBatchesForJob = (
  jobId,
  client,
  completedBatchIds,
  emitter,
  timerId) => {
  util.getJobBatches(jobId, client)
  .then((batchList) => {
    logger.tag('JOB BATCH LIST').debug({log: {batches: batchList}});
    batchList.forEach((batch) => {
      if (batch.state === 'Completed' && completedBatchIds.indexOf(batch.id) === -1) {
        completedBatchIds.push(batch.id);
        emitter.emit(util.BATCH_COMPLETED, {jobId: jobId, batchId: batch.id, client: client});
      }
    });
    if (completedBatchIds.length >= batchList.length)
      emitter.emit(util.STOP_POLLING, timerId);
  })
  .catch((err) => {
    logger.tag('JOB BATCH LIST').error({err: err});
  });
}

let createEventEmitter = (eventsArray = []) => {
  let emitter = new EventEmitter();
  eventsArray.forEach((event) => {
    switch (event) {
      case util.BATCH_COMPLETED:
        emitter.addListener(util.BATCH_COMPLETED, batchCompletedListener);
        break;
      case util.STOP_POLLING:
        emitter.addListener(util.STOP_POLLING, stopPollingListener);
        break;
      default:

        break;
    }
  });
  return emitter;
};

/**
 * Event listeners....
 */

let batchCompletedListener = (data) => {
  // add logic to fetch batch result!
  util.getBatchResult(
    data.jobId,
    data.batchId,
    data.client)
  .then((batchResult) => {
    logger.tag(`fetched batch result for batchId: ${data.batchId}`).debug({log: {job: data}});
    // logic to send result to storage service of POSX
  })
  .catch((err) => {
    logger.tag('BATCH RESULT').error({err: err});
  });
}
;

let stopPollingListener = (timerId) => {
  clearInterval(timerId);
  logger.info({log: {info: 'Polling stopped for batches'}});
}
