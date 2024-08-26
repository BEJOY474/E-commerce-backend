const createErro = require('http-errors')
const bcrypt = require('bcryptjs')


const {
    User
} = require('../model/user.model')
const {
    successResponse
} = require('./errorSuccess.controller')
const mongoose = require('mongoose')
const {
    findWithId
} = require('../services/findItem')
const {
    deleteImage
} = require('../src/helper/deleteImage')

const fs = require('fs').promises

const config = require('../config/config')
const {
    jsonWebToken
} = require('../src/helper/jsonWebToken')
const {
    emailWithNodeMailer
} = require('../src/helper/email')

const jwt = require('jsonwebtoken');
const {
    runValidation
} = require('../src/validator')
const { handleUserAction, findUser, findUserByIds, deleteUserByIds, updateUserByIds, updateUserPasswordByIds, forgatePasswordByEmail, resetPasswordUserByEmail } = require('../services/userService')
const createHttpError = require('http-errors')


const secretKey = config.Secret_key.key
const smptUserName = config.SMTP.userName
const smptPassword = config.SMTP.password
const clientUrl = config.Client_url.url
const reset_password_key = config.Secret_key.reset_password_key

exports.getAllUsers = async (req, res, next) => {
    try {
        //pagination
        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || 2

        //search user
        const search = req.query.search || ""
       
        const {users, pagination} = await findUser(search, limit, page)

        return successResponse(res, {
            statusCode: 201,
            message: "Success",
            payload: {
                users,
                pagination
            }

        })

    } catch (error) {
        next(createErro(error))
    }
}

exports.getSingleUserById = async (req, res, next) => {
    try {
        const id = req.params.id
        const option = {
            password: 0
        } // data jokhon show korbe tokhon password dekhabe na

        //find user
        const user = await findUserByIds( id, option)

        return successResponse(res, {
            statusCode: 202,
            message: "Success",
            payload: {
                user
            }
        })
    } catch (error) {
        next(error)
    }
}

exports.deleteUserById = async (req, res, next) => {
    try {
        const id = req.params.id

        //find user
        await deleteUserByIds(id) //findItem.js theke call kora hoise with perameter

        return successResponse(res, {
            statusCode: 203,
            message: "User was deleted successfully",

        })
    } catch (error) {
        next(error)
    }
}

exports.processRegister = async (req, res, next) => {
    try {

        const {
            name,
            email,
            password,
            address
        } = req.body

        const newUser = {
            name,
            email,
            password,
            address
        }


        const image = req.file?.path


        if (image && image.size > 1024 * 1024 * 5) {
            throw createErro(400, 'File is too large. File should be less then 5MB')
        }

        const userExsists = await User.exists({
            email: email
        })

        if (userExsists) {
            throw createErro(409, "This email already exsists!. Try anouther email or login")
        }

        //set token with jwt
        const token = jsonWebToken({
            name,
            email,
            password,
            image: image,
            address
        }, secretKey, '12m')

        //prepare email
        const emailData = {
            email,
            sebject: 'Account Activation Mail',
            html: `
               <h2> Dear ${name}</h2>
               <p>Please click here to 
               <a href="${clientUrl}/api/users/verify/${token}" target="_blank" >activate your account</a> </p>
            `
        }


        //send email with nodemailer
        try {
            await emailWithNodeMailer(emailData)
        } catch (emailError) {
            next(createErro(500, 'Faild to send varification email'))
            return
        }

        //console.log(token)

        return successResponse(res, {
            statusCode: 203,
            message: `Please go to user ${email} for completing you registration process`,
            payload: {
                token
            }

        })

    } catch (error) {
        next(error)
    }
}

exports.activateAccount = async (req, res, next) => {
    try {

        const token = req.body.token

        // console.log("Your token is :", token)

        if (!token) throw createErro(404, "token not found")

        const decoded = jwt.verify(token, secretKey)

        if (!decoded) throw createErro(404, "User is not varifide")


        console.log("Your decoded is :", decoded.payload.image)

        const userExsists = await User.exists({
            email: decoded.payload.email
        })

        if (userExsists) {
            throw createErro(409, "This email already exsists!. Try anouther email or login")
        }

        await User.create(decoded.payload)

        return successResponse(res, {
            statusCode: 201,
            message: "User was registered successfully",

        })
    } catch (error) {
        next(error)
    }
}

exports.updateUserById = async (req, res, next) => {
    try {
        const id = req.params.id

        const updateUser = await updateUserByIds(id, req)

        return successResponse(res, {
            statusCode: 203,
            message: "User was updated successfully",
            payload: updateUser

        })
    } catch (error) {
        next(error)
    }
}

exports.handleBandUnbannedUserById = async (req, res, next) => {
    try {
      
        const id = req.params.id
        
        const action = req.body.action
      //  console.log(action)
        const successMessage = await handleUserAction(id, action)

        return successResponse(res, {
            statusCode: 203,
            message: successMessage,
          //  payload: updateUser

        })
    } catch (error) {
        next(error)
    }
}

exports.handleUpdatePassword = async (req, res, next) => {
    try {
      
        const id = req.params.id
        
        const {email, oldPassword, newPassword, confirmedPassword} = req.body

        const updateUser = await updateUserPasswordByIds(id, email, oldPassword, newPassword, confirmedPassword)
 
        return successResponse(res, {
            statusCode: 203,
            message: "User password updated successfully",
            payload: {updateUser}

        })
    } catch (error) {
        next(error)
    }
}

exports.handleForgatePassword = async (req, res, next) => {
    try {
      
       //  const id = req.params.id
        
        const {email} = req.body

        const token =await forgatePasswordByEmail(email)

        return successResponse(res, {
            statusCode: 203,
            message: `Please go to user ${email} for reset you password`,
            payload: {
                token
            }

        })


    } catch (error) {
        next(error)
    }
}

exports.handleResetPassworUserByEmailAndToken = async (req, res, next) => {
    try {
        
        const {token, newPassword} = req.body

        const updateUser = await resetPasswordUserByEmail(token, newPassword)

        // const updateUser = await updateUserByIds(id, req)

        return successResponse(res, {
            statusCode: 203,
            message: "User password reset successfully",
            payload: {updateUser}

        })
    } catch (error) {
        next(error)
    }
}
