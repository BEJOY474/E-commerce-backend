const {
    body
} = require('express-validator');

//regitration validation
exports.validatesProduct = [
    body("name")
    .trim()
    .notEmpty()
    .withMessage("Product name is required")
    .isLength({
        min: 3,
        max: 150
    })
    .withMessage("Product name should be at least 3-150 chracter long"),


    body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({
        min: 1,
        max: 250
    })
    .withMessage("Description should be at least 1-250 chracter long"),


    body("price")
    .trim()
    .notEmpty()
    .withMessage("Price product name is required")
    .isFloat({min : 0})
    .withMessage("Price must be grether then 0"),


    body("quantity")
    .trim()
    .notEmpty()
    .withMessage("Quantity is required")
    .isFloat({min : 0})
    .withMessage("Quantity should be grether then 0"),


]

