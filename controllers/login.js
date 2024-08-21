const loginRouter = require('express').Router();    
const bcrypt = require('bcryptjs')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
require('express-async-errors') // elimates the need to pass next function to catch errors
const logger = require('../utils/logger')

const verify = async (user,password) => {

    const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(password, user.passwordHash)

    logger.info('password correct', password)

    return passwordCorrect  
}

loginRouter.post('/', async (request, response) => {

    const body = request.body

    const user = await User.findOne({username: body.username})

    if (await verify(user, body.password)) {

        const token = jwt.sign({username: user.username, id: user._id}, process.env.SECRET)
        
        return response.status(200).send({token, username: user.username, name: user.name})

        //create token for user
        
    }else{
        //failed response code
        return response.status(401).json({error: 'invalid username or password'})
    }
    


})


loginRouter.use((error, request, response, next) => {
    if (err.message) {
        logger.error(err)
        res.status(500).send(err.message);
      } else {
        logger.error('An error occurred')
        res.status(500).send('Something broke!')
    }
})

module.exports = loginRouter