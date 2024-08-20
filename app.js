
const config = require('./utils/config')
const mongoose = require('mongoose')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const express = require('express')
const app = express()
const logger = require('./utils/logger')    
//const cors = require('cors')




mongoose.set('strictQuery', false)
//change to logger
logger.info('connecting to', config.MONOGODB_URI)
mongoose.connect(config.MONOGODB_URI)
    .then(result => {
        logger.info('connected to MongoDB')
    })
    .catch(error => {
        logger.error('error connecting to MongoDB:', error.message)
    })


app.use(express.json())
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)

module.exports = app