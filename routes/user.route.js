const express = require('express')
const route = express.Router()

const {
    getAllUsers,
    getSingleUserById,
    deleteUserById,
    processRegister,
    activateAccount,
    updateUserById,
    handleBandUnbannedUserById,
    handleUpdatePassword,
    handleForgatePassword
    ,
    handleResetPassworUserByEmailAndToken
} = require('../controllers/user.controller')
const {
    allProduct
} = require('../controllers/product.controller')
const {
    upload
} = require('../middleware/uploadFile')
const {
    validateUserRegistration,
    validateUserUpdatePassword,
    validateResetPassword,
    validateUserForgatePassword
} = require('../src/validator/auth')
const {
    runValidation
} = require('../src/validator')
const { isLoggedIn, isLoggedOut, isAdmin } = require('../middleware/auth')

route.post("/process-register", upload.single("image"), isLoggedOut,
    validateUserRegistration, runValidation, processRegister)
route.post("/verify",isLoggedOut,  activateAccount)

route.get("/", isLoggedIn, isAdmin,  getAllUsers)
route.get("/:id([0-9a-fA-F]{24})", isLoggedIn,  getSingleUserById)
route.delete("/:id([0-9a-fA-F]{24})", isLoggedIn, deleteUserById)

route.put("/resetPassword",validateResetPassword, runValidation, handleResetPassworUserByEmailAndToken)

route.put("/:id([0-9a-fA-F]{24})",  upload.single("image"),isLoggedIn, updateUserById)
route.put("/manageUserBanUnban/:id([0-9a-fA-F]{24})" ,isLoggedIn, isAdmin, handleBandUnbannedUserById)
route.put("/updatePassword/:id([0-9a-fA-F]{24})" ,isLoggedIn, validateUserUpdatePassword, runValidation , handleUpdatePassword)
route.post("/forgetPassword", validateUserForgatePassword, runValidation, handleForgatePassword)


module.exports = route