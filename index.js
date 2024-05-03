const app = require('./app')
const config = require('./utils/config')
const logger = require('./utils/logger')
app.get('/', (request, response) => {

    response.send('<h1>Hello World!</h1>')
    
})

const PORT = config.port

app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`)
})