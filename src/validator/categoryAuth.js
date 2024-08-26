const {
    body
} = require('express-validator');

//regitration validation
exports.validateCategory = [
    body("name")
    .trim()
    .notEmpty()
    .withMessage("Category name is required")
    .isLength({
        min: 3,
        max: 31
    })
    .withMessage("Category name should be at least 3-31 chracter long"),

 
]

