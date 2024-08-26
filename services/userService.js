const createHttpErro = require("http-errors")
const  mongoose  = require("mongoose")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');

const {
    User
} = require("../model/user.model")
const { findWithId } = require("./findItem")
const { deleteImage } = require("../src/helper/deleteImage")
const { jsonWebToken } = require("../src/helper/jsonWebToken")
const { emailWithNodeMailer } = require("../src/helper/email")

const config = require('../config/config')
const clientUrl = config.Client_url.url
const reset_password_key = config.Secret_key.reset_password_key

exports.findUser = async (search, limit, page) => {

    try {
        const searchRegExp = new RegExp(".*" + search + ".*", "i") // mane holo ekta name e fst and last value ja e thak na keno middle er search value mille shei name ta return korbe

        const filter = {
            isAdmin: {
                $ne: true
            },
            $or: [{
                    name: {
                        $regex: searchRegExp
                    }
                },
                {
                    email: {
                        $regex: searchRegExp
                    }
                }
            ]
        }

        const option = {
            password: 0
        } // data jokhon show korbe tokhon password dekhabe na

        //find user
        const users = await User.find(filter, option).limit(limit).skip((page - 1) * limit)

        const count = await User.find(filter).countDocuments()

        if (!users) throw createErro(404, "No user found!")

        return {
            users,
            pagination: {
                totalPage: Math.ceil(count / limit),
                currentPage: page,
                previousPage: page - 1 > 0 ? page - 1 : null,
                nextPage: page + 1 <= Math.ceil(count / limit) ? page + 1 : null
            }
        }


    } catch (error) {
        throw error
    }

}

exports.findUserByIds = async (id, option = {}) => {
    try {
        const user = await findWithId(User, id, option)
        if (!user) {
            throw createHttpErro(404, "user not found")
        }

        return user

    } catch (error) {
        if(error instanceof mongoose.Error.CastError){ //custing error user id wrong dele ey error show hobe
            throw createHttpErro(404, "Invalide id!")
        }
        throw error
    }
}

exports.deleteUserByIds = async (id) => {
    try {
        const userr = await findWithId(User, id)
        if (!userr) {
            throw createHttpErro(404, "user not found")
        }

       const user = await User.findByIdAndDelete({
            _id: id,
            isAdmin: false
        })

        if(user && user.image){
          await deleteImage(user.image) //deleteImage.js theke call kora hoise image delete korar jonno
        }

    } catch (error) {
        if(error instanceof mongoose.Error.CastError){
            throw createHttpErro(404, "Invalide id!")
        }
        throw error
    }
}

exports.updateUserByIds = async (id, req) => {
    try {
        const option = {
            password: 0
        }
        const user = await findWithId(User, id, option)

        if (!user) {
            throw createHttpErro(404, "user not found")
        }

        const updateOptions = {
            new: true,
            runValidators: true,
            context: 'query'
        }

        let updates = {}


        for (let key in req.body) {
            if (['name', 'password', 'address'].includes(key)) {
                updates[key] = req.body[key]
            }
        }

        const image = (req.file?.path)

        if (image && image.size > 1024 * 1024 * 5) {
            throw createErro(400, 'File is too large. File should be less then 5MB')
        }

        updates.image = image

        const updateUser = await User.findByIdAndUpdate(id, updates, updateOptions).select("-password")

        if (!updateUser) {
            throw createErro(404, "Update faild")
        }

        return updateUser

    } catch (error) {
        if(error instanceof mongoose.Error.CastError){
            throw createHttpErro(404, "Invalide id!")
        }
        throw error
    }
}

exports.updateUserPasswordByIds = async (id,email, oldPassword, newPassword, confirmedPassword) => {
    try {
        const user = await findWithId(User, id)
        if (!user) {
            throw createHttpErro(404, "user not found")
        }

        const userWithEmail = await User.findOne({email : email})
        if (!userWithEmail) {
            throw createHttpErro(404, "Email dose not exist")
        }


        //password matching
        const isLoginMathch = await bcrypt.compare(oldPassword, user.password)

        //password matching
        if (!isLoginMathch) {
            throw createHttpErro(404, "Old password is not matched");
        }

        //new password & confirm password matching
        if (newPassword !== confirmedPassword) {
            throw createHttpErro(404, "new password & confirm password is not matched");
        }

        const updateUser = await User.findByIdAndUpdate(id, {password : newPassword },  {new : true}).select("-password")
       
        if (!updateUser) {
            throw createHttpErro(404, "User password was not update");
        }

        return updateUser

    } catch (error) {
        if(error instanceof mongoose.Error.CastError){
            throw createHttpErro(404, "Invalide id!")
        }
        throw error
    }
}

exports.forgatePasswordByEmail = async (email) => {
    try {
        const userData = await User.findOne({email : email})
        if (!userData) {
            throw createHttpErro(404, "Email dose not exist in this email!. You have to registration first.")
        }


       //set token with jwt
       const token = jsonWebToken({ email}, reset_password_key, '12m')

       //prepare email
       const emailData = {
           email,
           sebject: 'Reset Password Email',
           html: `
              <h2> Dear ${userData.name}</h2>
              <p>Please click here to 
              <a href="${clientUrl}/api/users/resetPassword/${token}" target="_blank" >Reset your password</a> </p>
           `
       }


       //send email with nodemailer
       try {
           await emailWithNodeMailer(emailData)
       } catch (emailError) {
           next(createHttpErro(500, 'Faild to send reset password email'))
           return
       }

       //console.log(token)
        return token

    } catch (error) {
        throw error
    }
}

exports.resetPasswordUserByEmail = async (token, newPassword) => {
    try {
       
        if (!token) throw createHttpErro(404, "token not found")

        const decoded = jwt.verify(token, reset_password_key)

        if (!decoded) throw createHttpErro(404, "Invalid token")

   
        const filter = {email: decoded.payload.email}

        const updateUser = await User.findOneAndUpdate(filter, {password : newPassword },  {new : true}).select("-password")
    
        if (!updateUser) {
            throw createHttpErro(404, "Password reset faild!");
        }

        return updateUser

    } catch (error) {
        
        throw error
    }
}


exports.handleUserAction = async (id, action) => {
    try {

        let updates
        let successMessage
        if (action === 'ban') {
            updates = {
                isBanned: true
            }
            return successMessage = "Banned is successfully"
        } else if (action === 'unban') {
            updates = {
                isBanned: false
            }
            return successMessage = "Unbanned is successfully"
        } else {
            throw createHttpErro(404, "Invalide action.Use 'ban' or 'unban' ")
        }

        const updateOptions = {
            new: true,
            runValidators: true,
            context: 'query'
        }


        const updateUser = await User.findByIdAndUpdate(id, updates, updateOptions).select("-password")

        if (!updateUser) {
            throw createErro(404, "Update faild")
        }
    } catch (error) {
        throw (error)
    }
}