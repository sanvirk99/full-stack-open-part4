const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const assert = require('assert')
const api = supertest(app)
const User = require('../models/user')
const bcrypt = require('bcryptjs')





beforeEach(async () => {

    await User.deleteMany({})
    const newUser = {
        username: "testuser0",
        name: "testname0",
        passwordHash: "testpassword0"        
    }

    const users = [
        {
            username: "testuser1",
            name: "testname1",
            passwordHash: "testpassword1"
        },
        {
            username: "testuser2",
            name: "testname2",
            passwordHash: "testpassword2"
        }
    ]
    

    for (let user of users) {
        let userObject = new User(user)
        await userObject.save()
    }
})

//get list of users
test('get all users', async () => {
    const response = await api.get('/api/users')
    assert.strictEqual(response.status, 200)
    assert.strictEqual(response.body.length, 2)

    const usernames = response.body.map(user => user.username)

    assert(usernames.includes('testuser1'))
    assert(usernames.includes('testuser2'))
})  


test('add user', async () => {  

    const saltRounds = 10
    password="secretpassword"
   
    const hash = await bcrypt.hash(password, saltRounds)
  

    const newUser = {
        username: "testuser",
        name: "testname",
        password: password
    }

    const response = await api.post('/api/users').send(newUser)

    assert.strictEqual(response.status, 201)
    assert.strictEqual(response.body.username, newUser.username)
    assert.strictEqual(response.body.name, newUser.name)

    //assert.strictEqual(response.body.passwordHash, hash)
    
    const isPasswordCorrect = await bcrypt.compare(password, response.body.passwordHash)
    assert.strictEqual(isPasswordCorrect, true)


})

test ('invalid user or password', async () => { 


    //bad password length < 3
    const newUser = {
        username: "testuser",
        name: "testname",
        password: "12"
    }

    const response = await api.post('/api/users').send(newUser)
    assert.strictEqual(response.status, 400)
    assert.strictEqual(response.body.error, 'invalid username or password')


    //bad username length < 3
    const newUser2 = {
        username: "12",
        name: "testname",
        password: "password"
    }
    const response2 = await api.post('/api/users').send(newUser2)
    assert.strictEqual(response2.status, 400)

    assert.strictEqual(response2.body.error, 'invalid username or password')

    //missing fields
    const newUser3 = {
        username: "testuser",
        name: "testname"
    }

    const newUser4 = {
    
    }

    const response3 = await api.post('/api/users').send(newUser3)
    assert.strictEqual(response3.status, 400)
    assert.strictEqual(response3.body.error, 'missing fields')

    const response4 = await api.post('/api/users').send(newUser4)
    assert.strictEqual(response4.status, 400)
    assert.strictEqual(response4.body.error, 'missing fields')


})

after(async () => {
    await mongoose.connection.close()
  })