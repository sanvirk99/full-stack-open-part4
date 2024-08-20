const bcrypt = require('bcryptjs')
const usersRouter = require('express').Router()
const User = require('../models/user')
require('express-async-errors') // elimates the need to pass next function to catch errors

usersRouter.get('/', async (request, response) => {

  //will use stored id to create a type of realtion db join
  const users = await User.find({}).populate('blogs') 

  response.json(users)
})


const validatePassword = (password) => {
  if (password.length < 3) {
    return false
  }
  return true
}


const validateUsername = (username) => {
  if (username.length < 3) {
    return false
  }
  return true
}


usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  //all fields are required
  if (!username || !name || !password) {
    return response.status(400).json({
      error: 'missing fields'})
  }


  if (!validatePassword(password) || !validateUsername(username)) {
    return response.status(400).json({
      error: 'invalid username or password'})
  }



  
  const saltRounds = 10
  const hash = await bcrypt.hash(password, saltRounds)
  const user = new User({
    username: username,
    name: name,
    passwordHash: hash,
  })

  const savedUser = await user.save()


  response.status(201).json(savedUser)
})


//automatically handdel mongodb errors
usersRouter.use((error, request, response, next) => {
  
  if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
    return response.status(400).json({ error: 'username must be unique' })
  }
})

module.exports = usersRouter