const {test , beforeEach , after} = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const assert = require('assert')
const User = require('../models/user')
const Blog = require('../models/blog')
const api = supertest(app)
const bcrypt = require('bcryptjs')
const { request } = require('http')


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

const test_users = [
    {
        username: "testuser0",
        name: "testname0",
        password: "testpassword0"
    },
    {
        username: "testuser1",
        name: "testname1",
        password: "testpassword1"
    }
]


beforeEach(async () => {
    await User.deleteMany({})
    await Blog.deleteMany({})


})



test('obtain token login route, create blog and then delete the blog', async () => {

    //login route
    
    
    let testuser = test_users[0]
    
    //add user to database
    const postuser= await api.post('/api/users').send(testuser)

  
    assert(postuser.status===201)
   
    const response = await api
        .post('/api/login')
        .send(testuser)
    assert(response.status===200)




    let invalid = {
        username : 'invalid',   
        password : 'invalid'
    }

    const response2 = await api
        .post('/api/login')
        .send(invalid)

    assert(response2.status===401)


    const blogResponse = await api
    .post('/api/blogs')
    .set({'Authorization': `Bearer ${response.body.token}`})
    .send(test_blogs[0]);

    assert(blogResponse.status===201)


    const user_after = await api.get('/api/users')

    const json = JSON.parse(JSON.stringify(user_after.body))

    const blog = json[0].blogs[0]

    assert.strictEqual(JSON.stringify(blog),JSON.stringify(blogResponse.body))


    // get the user to delete the blog they created
    blogIdDelete = blogResponse.body.id

    //create anohter user who try to delete the blog but not the creator
    const postuser2= await api.post('/api/users').send(test_users[1])
    const tokenUser2=(await api.post('/api/login').send(test_users[1])).body.token

    // const before_delete = await api.get('/api/users')
    // console.log(JSON.parse(JSON.stringify(before_delete.body)))

    const badId = '1234'
    const badIdResponse = await 
        api.delete(`/api/blogs/${badId}`)
        .set({'Authorization': `Bearer ${response.body.token}`})
        .set('Content-Type', 'application/json')

    
    assert(badIdResponse.status===400)

    const unauthorized = await 
        api.delete(`/api/blogs/${blogIdDelete}`)
        .set({'Authorization': `Bearer ${tokenUser2}`})
        .set('Content-Type', 'application/json')

    assert(unauthorized.status===401)


    const deleteResponse = await 
        api.delete(`/api/blogs/${blogIdDelete}`)
        .set({'Authorization': `Bearer ${response.body.token}`})
        .set('Content-Type', 'application/json')

    assert(deleteResponse.status===204)


    //have to make sure user blog array does not contain the deleted blog

    const user_after_delete = await api.get('/api/users')

   // console.log(user_after_delete.body)

    const json_after = JSON.parse(JSON.stringify(user_after_delete.body))

    assert.strictEqual(json_after[0].blogs.length,0)


})




after( async () => {
    await mongoose.connection.close()
})


