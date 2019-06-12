const express = require('express')
const router = express.Router()
const passport = require('passport')
require('../auth/passport')(passport)
const userCtrl = require('./../controllers/user')
const expressJoi = require('express-joi-validator')
const requestValidation = require('./../utils/requestValidation')
const logger = require('./../utils/logger')

router.post('/signin', logger.requestLog, expressJoi(requestValidation.userSignin), userCtrl.signin)
/* GET users listing. */
router.get('/', (req, res, next) => {
  res.send('respond with a resource')
})
router.post('/signup', logger.requestLog,passport.authenticate('jwt', { session : false }), userCtrl.signup)
router.post('/adduser', logger.requestLog, passport.authenticate('jwt', { session : false }), userCtrl.addUser)
router.post('/edituser', logger.requestLog, passport.authenticate('jwt', { session : false }), userCtrl.editUser)
router.post('/changepassword', logger.requestLog, passport.authenticate('jwt', { session : false }), userCtrl.changepassword)
router.post('/forgetpassword', logger.requestLog, userCtrl.forgetpassword)
router.post('/deleteuser', logger.requestLog, passport.authenticate('jwt', { session : false }), userCtrl.deleteuser)
router.post('/fetchalluser', logger.requestLog,passport.authenticate('jwt', { session : false }), userCtrl.fetchAlluser)


module.exports = router
