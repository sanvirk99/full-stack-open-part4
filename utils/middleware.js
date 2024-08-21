

const tokenExtractor = (request, response, next) => {

    request['token']=null
    const authorization = request.headers['authorization']
    if (authorization && authorization.startsWith('Bearer ')) {
        
        request['token']=authorization.replace('Bearer ','')
    }

    next()
}


module.exports = {tokenExtractor}