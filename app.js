const createError = require('http-errors')
const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')
const passport = require('passport')
const logger = require('./utils/logger')
const config = require('./config/database')
const cors = require('cors')
const bodyParser = require('body-parser')


const app = express()
app.use(cors())
// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.use(passport.initialize())
app.use(morgan('dev', { stream: logger.stream }))
app.use(bodyParser.json({extended: true, limit:'50mb'})); 
app.use(express.json({limit: '50mb'}))
//entity too large issue fixed by changing following files.
//node_modules -> body-parser -> lib -> types -> urlencoded.js changes 100kb to 100000kb
//node_modules -> body-parser -> lib -> types -> json.js changes 100kb to 100000kb
app.use(bodyParser.urlencoded({extended:true, limit:'50mb'}));
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
mongoose.Promise = require('bluebird')
mongoose.connect(config.database, { promiseLibrary: require('bluebird') })
  .then(async () => {
    console.log('connection succesful')
    const indexRouter = require('./routes/index')
    const usersRouter = require('./routes/users')
    const eventRouter = require('./routes/events')
    const newsRouter = require('./routes/news')
    const subscriberRouter = require('./routes/subscribers')
    app.use('/', indexRouter)
    app.use('/api/users', usersRouter)
    app.use('/api/events', eventRouter)
    app.use('/api/news', newsRouter)
    app.use('/api/subscriber', subscriberRouter)
    
    // catch 404 and forward to error handler
    app.use((req, res, next) => {
      next(createError(404))
    })
    // error handler
    app.use((err, req, res, next) => {
      // set locals, only providing error in development
      res.locals.message = err.message
      res.locals.error = req.app.get('env') === 'development' ? err : {}
      logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`)
      // render the error page
      if (err.isBoom) {
        return res.status(err.output.statusCode).json(err.output.payload)
      }
      res.status(err.status || 500)
      res.sendFile(path.join(__dirname, 'public/index.html'))
    })
  })
  .catch((err) => console.error(err))

module.exports = app
