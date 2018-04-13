const router = require('express').Router()

const AWS = require('aws-sdk')
const kinesis = new AWS.Kinesis({ region: 'us-east-1' })
const Record = require('../data/record-generator')

router.get('/describe:streamName?', (req, res) => {
  kinesis.describeStream({ StreamName: req.query.streamName }, (error, data) => {
    if (error) {
      return res.status(500).json({ error, message: 'Error' })
    }
    return res.status(200).json({ error: null, message: data })
  })
})

router.post('/put-record', (req, res) => {
  // for now, we dont care about body, we just create a new trade
  const newRecord = new Record()
  const params = {
    Data: JSON.stringify(newRecord.generate()),
    PartitionKey: 'mason-test',
    StreamName: 'GUAPI_Stream'
  }
  kinesis.putRecord(params, (error, data) => {
    if (error) {
      return res.status(500).json({ error, message: 'Error' })
    }
    return res.status(200).json({ error: null, message: data })
  })
})

// NOTE AWS recommends running getRecords in a loop to poll the stream
// since a successful response from getRecords returns the next shard iterator,
// calling describeStream and getShardIterator would only need to occur on the first loop
router.get('/get-records', (req, res) => {
  // 1 get shardId
  kinesis.describeStream({ StreamName: 'GUAPI_Stream' }, (error, streamData) => {
    if (error) {
      return res.status(500).json({ error, message: 'Error' })
    }
    const { ShardId } = streamData.StreamDescription.Shards[0]
    // 2 get shardIterator
    const params = {
      ShardId,
      ShardIteratorType: 'TRIM_HORIZON',
      StreamName: 'GUAPI_Stream'
    }
    kinesis.getShardIterator(params, (error, shardIteratorData) => {
      if (error) {
        return res.status(500).json({ error, message: 'Error' })
      }
      const { ShardIterator } = shardIteratorData
      // 3 get records
      kinesis.getRecords({ ShardIterator }, (error, recordData) => {
        if (error) {
          return res.status(500).json({ error, message: 'Error' })
        }
        return res.status(200).json({ error: null, message: recordData })
      })
    })
  })
})

module.exports = router
