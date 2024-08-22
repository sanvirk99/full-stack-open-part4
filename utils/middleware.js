const User = require('../models/user')
const jwt = require('jsonwebtoken')


const tokenExtractor = (request, response, next) => {

    request['token']=null
    const authorization = request.headers['authorization']
    if (authorization && authorization.startsWith('Bearer ')) {
        
        request['token']=authorization.replace('Bearer ','')
    }

    next()
}

const userExtractor = async (request, response, next) => {
    const token = request.token
    request['user']=null  
    try {
        if (token) {

            const decodedToken = jwt.verify(token, process.env.SECRET);
            
            if(!decodedToken || !decodedToken.id){
                return response.status(401).json({error: 'token missing or invalid'})
            }
      
            request['user'] = await User.findById(decodedToken.id);

        }
        next();
    } catch (error) {
        next(error); // Pass the error to the next middleware
    }
}


module.exports = {tokenExtractor, userExtractor}