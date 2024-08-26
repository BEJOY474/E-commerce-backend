const createErro = require('http-errors')
const {
    User
} = require('../model/user.model')
const {
    successResponse
} = require('./errorSuccess.controller')
const {
    jsonWebToken
} = require('../src/helper/jsonWebToken')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs')

const config = require('../config/config')
const secretAccessKey = config.Secret_key.access_key

exports.handlelogin = async (req, res, next) => {
    try {
        const {
            email,
            password
        } = req.body

        //is exist user 
        const user = await User.findOne({
            email
        })

        if (!user) {
            throw createErro(404, "User does not exixst with this email. You have to register first");
        }

        //password matching
        const isLoginMathch = await bcrypt.compare(password, user.password)

        //password matching
        if (!isLoginMathch) {
            throw createErro(404, "Password not matched");
        }

        //isBand check
        if (user.isBanned) {
            throw createErro(403, "User is banned");
        }


        //set token with jwt. here jwtAccessKey holo secretAccessKey
        const access_token = jsonWebToken({
            user
        }, secretAccessKey, '7d')

        res.cookie('access_token', access_token, {
           maxAge:7* 24* 60 * 60 * 1000, //7 days token ta valid thakbe
            httpOnly: true,
            secure: true,
            sameSite: 'none'
        })

        
        //set token with jwt. here jwtAccessKey holo secretAccessKey
        // const refresh_token = jsonWebToken({
        //     user
        // }, secretAccessKey, '7d')

        // res.cookie('refresh_token', refresh_token, {
        //     maxAge:7* 24* 60 * 60 * 1000, //7 days token ta valid thakbe
        //     httpOnly: true,
        //     secure: true,
        //     sameSite: 'none'
        // })

        //is exist user With Out Password 
        const userWithOutPassword = await User.findOne({
            email
        }).select('-password') // password remove

        return successResponse(res, {
            statusCode: 202,
            message: "User loggedin successfully",
            payload: {
                userWithOutPassword
            }
        })

    } catch (error) {
        next(error)
    }
}

exports.handleloggedout = async (req, res, next) => {
    try {
        res.clearCookie('access_token')
        return successResponse(res, {
            statusCode: 202,
            message: "User loggedout successfully",
            payload: {

            }
        })

    } catch (error) {
        next(error)
    }
}


