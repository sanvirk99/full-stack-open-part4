const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const assert = require('assert')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
const { json } = require('express')
const { get } = require('http')






const test_blogs = [
    {

        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7,

    },
    {

        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5,

    }
]


beforeEach(async () => {    
    await Blog.deleteMany({})
    await User.deleteMany({})

    


})


test('create user then blog with user verify blogs array is populated along with user for blogs', async () => {  

    const user = {
        username: "testuser0",
        name: "testname0",
        password: "testpassword0"
    }
    
    const response = await api
        .post('/api/users')
        .send(user)

    const users=await User.find({})
    
    jsonuser=users.map(user => user.toJSON())


    const test_blog=test_blogs[0]
    test_blog['userId']=jsonuser[0].id

    const blog_response = await api
        .post('/api/blogs')
        .send(test_blog)

    
    const getUser=await api.get('/api/users')

    const jsonObject=JSON.parse(JSON.stringify(getUser.body))

    const saved_blog=jsonObject[0].blogs[0]

    // pretty print
    // console.log(JSON.stringify(jsonObject,null,2))

    // console.log(JSON.stringify(saved_blog))
    // console.log(JSON.stringify(blog_response.body))

   
    assert.strictEqual(JSON.stringify(saved_blog),JSON.stringify(blog_response.body))

    

    const getBlogs=await api.get('/api/blogs')

   // console.log(getBlogs.text)

    const jsonblogs=JSON.parse(JSON.stringify(getBlogs.body))

    assert.strictEqual(JSON.stringify(jsonblogs[0].user.id),JSON.stringify(jsonuser[0].id))
    assert.strictEqual(JSON.stringify(jsonblogs[0].user.username),JSON.stringify(jsonuser[0].username))
    assert.strictEqual(JSON.stringify(jsonblogs[0].user.name),JSON.stringify(jsonuser[0].name))



})







after(async () => {

    await mongoose.connection.close()

})