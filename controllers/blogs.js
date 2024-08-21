
const blogsRouter = require('express').Router();
const { error } = require('console');
const Blog = require('../models/blog');
const logger = require('../utils/logger');
const blog = require('../models/blog');
const User = require('../models/user');
require('express-async-errors') // elimates the need to pass next function to catch errors 
const jwt = require('jsonwebtoken');
const { url } = require('inspector');

//write test before implementing async await 

blogsRouter.get('/', async (request, response) => {
   
        let blogs = await Blog.find({}).populate('user')
        logger.info(blogs)
        response.json(blogs)

   

})



blogsRouter.post('/', async (request, response) => {
    
    const body=request.body
  
    const token = request.token
 
    const decodedToken = jwt.verify(token, process.env.SECRET)

    if(!decodedToken || !decodedToken.id){
        return response.status(401).json({error: 'token missing or invalid'})
    }
    
    const user = await User.findById(decodedToken.id)

    const blogObject = {
        title: body.title,
        url : body.url,
        likes: body.likes,
        user: user._id
    }

    const blog = new Blog(blogObject)
    const result=await blog.save()

    user.blogs = user.blogs.concat(result._id) //add blog id to user blog array needed for populate

    await user.save()

    return response.status(201).json(result)
})

blogsRouter.delete('/:id', async (request, response) => {

    const id=request.params.id;

    const toDelete=await blog.findByIdAndDelete(id)

    response.status(204).end()
    
})

blogsRouter.delete('/:id', async (request,response) => {

    if(!request.params.id){
        throw new Error('missing delete parameters')
    } 

    await blog.findByIdAndDelete(request.params.id)

    response.status(204).end()
    
    
})

blogsRouter.put('/:id', async (request,response) => {

    if(!request.body || !request.params.id){
        throw new Error('missing update parameters')
    } 

    //should verify incoming json object but skipping
    const {id,...withoutId} = request.body;
    console.log(withoutId)
    await blog.findByIdAndUpdate(request.params.id,withoutId,{new: true, runValidators: true, context: 'query'})

    response.status(204).end()

    
})


blogsRouter.use((err,req,res,next) => {

    console.log(err.message, 'error message')
    if (err.name=== 'ValidationError') {
        // Handle validation errors
        logger.error('Validation error: ' + err.message)
        res.status(400).send('Validation error: ' + err.message)
        return
    }else if (err.name === 'JsonWebTokenError') {

        return res.status(401).json({
            error: 'invalid token'
        }
        )
    }

    if (err.message) {
        logger.error(err)
        res.status(500).send(err.message);
      } else {
        logger.error('An error occurred')
        res.status(500).send('Something broke!')
      }
      
})


module.exports = blogsRouter;