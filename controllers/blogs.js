
const blogsRouter = require('express').Router();
const { error } = require('console');
const Blog = require('../models/blog');
const logger = require('../utils/logger');



blogsRouter.get('/', (request, response) => {
    Blog
        .find({})
        .then(blogs => {
            response.json(blogs)
        })
})



blogsRouter.post('/', (request, response) => {
    const blog = new Blog(request.body)
    console.log(request.body)
    blog
      .save()
      .then(result => {
        response.status(201).json(result)
      })
      .catch(error => {
        logger.error(error.message)
      })
  })

module.exports = blogsRouter;