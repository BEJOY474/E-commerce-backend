const {
    body
} = require('express-validator');

//regitration validation
exports.validateUserRegistration = [
    body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({
        min: 3,
        max: 31
    })
    .withMessage("Name should be at least 3-31 chracter long"),

    body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email is not valid"),

    body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({
        min: 8
    }) // Set min length to 8 to match the regex
    .withMessage("Password should be at least 8 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/)
    .withMessage("Password should include at least one uppercase letter, one lowercase letter, one number, and one special character"),

    body("image")
    .optional()
    .isString()
    .withMessage("Photo is required"),

    body("address")
    .trim()
    .notEmpty()
    .withMessage("address is required")
    .isLength({
        min: 3
    })
    .withMessage("address should be at least 3 chracter long"),

]

//login validation
exports.validateUserLogin = [
    body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email is not valid"),

    body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")

]

//update password validation
exports.validateUserUpdatePassword = [
    body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email is not valid"),

    body("oldPassword")
    .trim()
    .notEmpty()
    .withMessage("Old password is required"),

    body("newPassword")
    .trim()
    .notEmpty()
    .withMessage("New password is required")
    .isLength({
        min: 8
    }) // Set min length to 8 to match the regex
    .withMessage("Password should be at least 8 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/)
    .withMessage("Password should include at least one uppercase letter, one lowercase letter, one number, and one special character"),

    body("confirmedPassword")
    .trim()
    .notEmpty()
    .withMessage("Confirmed Password is required")
    .isLength({
        min: 8
    }) // Set min length to 8 to match the regex
    .withMessage("Password should be at least 8 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/)
    .withMessage("Password should include at least one uppercase letter, one lowercase letter, one number, and one special character"),

]

//forgate password validation
exports.validateUserForgatePassword = [
    body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email is not valid")

]

//reset password er token and newpassword validation
exports.validateResetPassword = [

    body("token")
    .trim()
    .notEmpty()
    .withMessage("Token is missing"),

    body("newPassword")
    .trim()
    .notEmpty()
    .withMessage("New password is required")
    .isLength({
        min: 8
    }) // Set min length to 8 to match the regex
    .withMessage("Password should be at least 8 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/)
    .withMessage("Password should include at least one uppercase letter, one lowercase letter, one number, and one special character"),

   
]

//refresh token validation
// exports.validateRefreshToken = [

//     body("token")
//     .trim()
//     .notEmpty()
//     .withMessage("Token is missing"),
   
// ]