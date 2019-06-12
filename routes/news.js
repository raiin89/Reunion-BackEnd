const express = require('express')
const router = express.Router()
const passport = require('passport')
require('../auth/passport')(passport)
const newsCtrl = require('./../controllers/news')
const logger = require('./../utils/logger')


router.post('/addnews', logger.requestLog, passport.authenticate('jwt', { session : false }), newsCtrl.addNews)
router.post('/updatenews', logger.requestLog, passport.authenticate('jwt', { session : false }), newsCtrl.updateNews)
router.get('/fetchallnews', logger.requestLog, passport.authenticate('jwt', { session : false }), newsCtrl.fetchAllNews)
router.get('/fetchpublishednews', logger.requestLog, newsCtrl.fetchpublishednews)
router.get('/fetchnewsbyid/:newsId', logger.requestLog, newsCtrl.fetchNewsById)
router.post('/addimagetonews', passport.authenticate('jwt', { session : false }), newsCtrl.addImageToNews)
router.post('/deletenews', logger.requestLog, passport.authenticate('jwt', { session : false }), newsCtrl.deleteNews)
router.post('/deleteimagefromnews', logger.requestLog, passport.authenticate('jwt', { session : false }), newsCtrl.deleteImageFromNews)
router.post('/updatenewsstatus', logger.requestLog, passport.authenticate('jwt', { session : false }), newsCtrl.updateNewsStatus)


module.exports = router
