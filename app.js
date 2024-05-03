
const config = require('./utils/config')
const blogsRouter = require('./controllers/blogs')
const express = require('express')
const app = express()
const mongoose = require('mongoose')
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

module.exports = app