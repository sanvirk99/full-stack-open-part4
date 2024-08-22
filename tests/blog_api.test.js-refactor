const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const assert = require('assert')
const api = supertest(app)
const Blog = require('../models/blog')





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

    },
    {

        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        likes: 12,
    },
    {

        title: "First class tests",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
        likes: 10,

    },
    {

        title: "TDD harms architecture",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
        likes: 0,

    },
    {

        title: "Type wars",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
        likes: 2,

    }
]

console.log('test started')


beforeEach(async () => { //use a for loop to load all notes into database
    await Blog.deleteMany({})
    let blogObject = new Blog(test_blogs[0])
    await blogObject.save()
    blogObject = new Blog(test_blogs[1])
    await blogObject.save()
})


test('notes are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('there are two blog', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, 2) //hardcode value 
})

test('the first blog is about React patterns ', async () => {
    const response = await api.get('/api/blogs')

    const contents = response.body.map(e => e.title)
    assert(contents.includes('React patterns'))
})


test(`test unique _id -> equals id, json method`, async () => {

    const response = await api.get('/api/blogs')

    const blogs = response.body;

    blogs.forEach(blog => {

        assert('id' in blog)
        assert(!('ids' in blog))

    })

})

//create a new post and check if the len increase by one 
test('create new post then check count increased by one', async () => {

    const response = await api.get('/api/blogs')
    const preLen = response.body.length //before each has two blogs loadeded
    const addBlog = test_blogs[preLen]
    const send = await api.post('/api/blogs')
        .send(addBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const postResponse = await api.get('/api/blogs')
    const postLen = postResponse.body.length

    const blogs = postResponse.body;

    const posted = blogs.find((blog) => {

        return blog.title === addBlog.title
    })

    assert(posted)
    assert.strictEqual(preLen + 1, postLen)

})

test('append like property initiliazed to 0 if missing', async () => {

    const addBlog = {

        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    }

    const send = await api.post('/api/blogs')
        .send(addBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const postResponse = await api.get('/api/blogs')
  
    const blogs = postResponse.body;

    const posted = blogs.find((blog) => {

        return blog.title === addBlog.title
    })

    assert(posted)

    //console.log(posted)
    assert('likes' in posted)

    assert(posted['likes']===0)



})

test('title and url must be present in the post', async () => {

    const addBlog = {
        author: "Edsger W. Dijkstra",   
    }

    await api.post('/api/blogs')
        .send(addBlog)
        .expect(400)
    
    addBlog.title="Algorithms"

    await api.post('/api/blogs')
        .send(addBlog)
        .expect(400)

    addBlog.url="http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html"

    await api.post('/api/blogs')
        .send(addBlog)
        .expect(201)

    
    // const postResponse = await api.get('/api/blogs')
  
    // const blogs = postResponse.body;

    // const posted = blogs.find((blog) => {

    //     return blog.title === addBlog.title
    // })

    // assert(posted)

})

test('deleting a blog post',async () => {

    const response=await api.get('/api/blogs');
    
    const toDelete=response.body.find(blog => blog.title==="React patterns")

    await api.delete(`/api/blogs/${toDelete.id}`)
            .expect(204)

    const postUpdate=await api.get('/api/blogs')
    const updated=postUpdate.body.find(blog => blog.id === toDelete.id)

    assert(updated===undefined)
        

})

test('testing the update functionality for a given id',async ()=> {

    const response=await api.get('/api/blogs');
    
    const toUpdate=response.body.find(blog => blog.title==="React patterns")

    assert(toUpdate.id)

    //change title

    toUpdate.title="React patterns and algo"

    await api.put(`/api/blogs/${toUpdate.id}`)
        .send(toUpdate)
        .expect(204)

    const postUpdate=await api.get('/api/blogs')

    const updated=postUpdate.body.find(blog => blog.id === toUpdate.id)

    assert(updated)

    assert(updated.id===toUpdate.id)

})


after(async () => {

    await mongoose.connection.close()

})