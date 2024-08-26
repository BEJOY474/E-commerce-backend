const mongoose = require('mongoose')
const config = require('./config')

const db_url = config.DB.url

const connectDB = async (options = {}) => {
    try {
        await mongoose.connect(db_url, options)
        console.log("DB is connected")
    } catch (error) {
        console.log("DB is no connected. Error : ", error)
        process.exit(1)
    }
}

module.exports = connectDB