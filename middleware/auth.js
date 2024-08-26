const createHttpErro = require("http-errors")
const jwt = require('jsonwebtoken');
const {
    Secret_key
} = require("../config/config");
const config = require('../config/config')
const secretAccessKey = config.Secret_key.access_key

exports.isLoggedIn =async (req, res, next) => {
    try {
        const token = req.cookies.access_token

    
        if (!token) {
            throw createHttpErro(401, "Access token not found. You have to login first")
        }

         const decoded = jwt.verify(token, secretAccessKey)
     
        if(!decoded){
            throw createHttpErro(401, "Invalid access token. Please login again")
        }
    
       
        req.user = decoded
      //  console.log("isLoggon check : ", req.user )
        next()

       
    } catch (error) {
        next(error)
    }
}

exports.isLoggedOut =async (req, res, next) => {
    try {
        const token = req.cookies.access_token
        if (token) {
            try {
                const decoded = jwt.verify(token, secretAccessKey)
                if(decoded){
                    throw createHttpErro(400, "User is already logged in")
                }
            } catch (error) {
                throw error
            }
        }
        next()

    } catch (error) {
       return next(error)
    }
}

exports.isAdmin =async (req, res, next) => {
    try {
      
        const loggeinUser = req.user

        if (!loggeinUser.payload.user.isAdmin) {
            throw createHttpErro(403, "Forbidden. You must be an user to access this resource")
        }

        next()
    } catch (error) {
       return next(error)
    }
}