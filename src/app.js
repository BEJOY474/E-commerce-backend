const express = require("express")
const app = express()
const userRoute = require('../routes/user.route')
const morgan = require('morgan')
const xssClean = require('xss-clean')
const rateLimit = require('express-rate-limit')
const connectDataBase = require('../config/db')
const seedRoute = require('../routes/seedRouter')
const categoryRoute = require('../routes/category.route')
const cookieParser = require('cookie-parser')
const cors = require('cors')

const {
    errorResponse
} = require("../controllers/errorSuccess.controller")

//Database connection
connectDataBase()

//api time limit rqst end
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minutes
    max: 15, // Limit each IP to 2 requests per `window` (here, per 1 minutes).
    message: "too many request"
})
//api time limit rqst end

//to show which url is pressed
app.use(morgan('dev'))

// body-parser add kora hoise start
const bodyParser = require('body-parser')
const connectDB = require("../config/db")
const authRoute = require("../routes/authRouter")
const productsRouter = require("../routes/products.route")
app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(bodyParser.json())
// body-parser add kora hoise end


//xss-clean
app.use(xssClean())
app.use(limiter)

//cookie use
app.use(cookieParser())

//all user route
app.use("/api/users", userRoute)

//all products route
app.use("/api/product", productsRouter)

//testing route with seedRoute
app.use("/api/seed", seedRoute)

//testing route with seedRoute
app.use("/api/seed", seedRoute)

//auth route with 
app.use("/api/auth", authRoute)

// cors set 
app.use(cors({
    origin: 'http://localhost:5173', // Replace with your frontend URL
  }));
  

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


//home route
app.get("/", (req, res) => {
    res.status(200).send("<h1>Wlcome to our page</h1>")
})




//error route for clint side middleware
app.use((req, res, next) => {
    res.status(404).send({
        message: "404 Route not found!"
    })
    next()
})

//error heldle for server side middleware
app.use((error, req, res, next) => {
    return res.status(error.status || 500).send({
        success: false,
        message: error.message
    })

    return errorResponse(res, {
        statusCode: error.status,
        message: error.message
    })
})

module.exports = app