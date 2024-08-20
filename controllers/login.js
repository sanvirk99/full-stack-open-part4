const loginRouter = require('express').Router();    
const bcrypt = require('bcryptjs')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
require('express-async-errors') // elimates the need to pass next function to catch errors

const verify = async (_username, _password) => {

    const user = await User.findOne({username: _username})

    const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(_password, user.passwordHash)


    console.log(passwordCorrect, "verifying if user in database")    
    return passwordCorrect  
}

loginRouter.post('/', async (request, response) => {

    const body = request.body

    const username = body.username
    const password = body.password
    


    if (await verify(username, password)) {
        
        return response.status(201).json()

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