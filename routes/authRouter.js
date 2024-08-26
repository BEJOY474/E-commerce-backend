const express = require('express')
const authRoute = express.Router()

const {runValidation} = require('../src/validator')
const { handlelogin, handleloggedout } = require('../controllers/auth.controller')
const { isLoggedOut, isLoggedIn } = require('../middleware/auth')
const { validateUserLogin } = require('../src/validator/auth')


authRoute.post("/login",isLoggedOut, validateUserLogin, runValidation,  handlelogin)
authRoute.post("/logout", isLoggedIn, handleloggedout)


module.exports = authRoute