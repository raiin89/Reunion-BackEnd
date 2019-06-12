const express = require('express')
const router = express.Router()
const subscriberCtrl = require('./../controllers/subscriber')
const logger = require('./../utils/logger')

router.post('/addsubscriber', logger.requestLog, subscriberCtrl.addSubscriber)


module.exports = router
