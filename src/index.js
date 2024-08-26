const app = require('./app')
const config = require('../config/config')
const serverPort = config.app.port

app.listen(serverPort, () => {
    console.log(`Server is running. http://localhost:${serverPort} `)

})