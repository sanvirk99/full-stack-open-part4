
const blogsRouter = require('express').Router();
const { error } = require('console');
const Blog = require('../models/blog');
const logger = require('../utils/logger');
const { response } = require('../app');
const blog = require('../models/blog');
require('express-async-errors') // elimates the need to pass next function to catch errors 


//write test before implementing async await 

blogsRouter.get('/', async (request, response) => {
    // Blog
    //     .find({})
    //     .then(blogs => {
    //         logger.info(blogs)
    //         response.json(blogs)
    //     })

        //no need for try catch blocks
        let blogs = await Blog.find({})
        logger.info(blogs)
        response.json(blogs)

   

})



blogsRouter.post('/', async (request, response) => {
    
    const toAdd=request.body
    if(!('likes' in toAdd)){

        toAdd['likes']=0
    }
   
    const blog = new Blog(toAdd)
  
    const result=await blog.save()
    response.status(201).json(result)
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

    console.log(err.message)
    if (err.name=== 'ValidationError') {
        // Handle validation errors
        logger.error('Validation error: ' + err.message)
        res.status(400).send('Validation error: ' + err.message)
        return
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