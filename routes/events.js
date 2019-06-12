const express = require('express')
const router = express.Router()
const passport = require('passport')
require('../auth/passport')(passport)
const eventCtrl = require('./../controllers/event')
const logger = require('./../utils/logger')


router.post('/addEvent', logger.requestLog, eventCtrl.addEvent)
router.post('/addimagetoevent', eventCtrl.addImageToEvent)
router.post('/updatestatus', logger.requestLog, passport.authenticate('jwt', { session : false }), eventCtrl.updateStatus)
router.get('/fetchallevents', logger.requestLog, passport.authenticate('jwt', { session : false }), eventCtrl.fetchAllEvents)
router.get('/fetchapprovedevents', logger.requestLog, eventCtrl.fetchApprovedEvents)
router.get('/fetcheventbyid/:eventId', logger.requestLog, eventCtrl.fetchEventByID)
router.post('/deleteevent', logger.requestLog, passport.authenticate('jwt', { session : false }), eventCtrl.deleteEvent)


module.exports = router
