const express = require('express')
const { handelCreteCategory, handelGetCategory, handelGetSingleCategory, handelUpdateCategory, handelDeleteCategory } = require('../controllers/category.controller')
const { validateCategory } = require('../src/validator/categoryAuth')
const { runValidation } = require('../src/validator')
const { isLoggedIn, isAdmin } = require('../middleware/auth')
const categoryRoute = express.Router()


categoryRoute.post("/create", isLoggedIn, isAdmin, validateCategory, runValidation, handelCreteCategory )
categoryRoute.get("/", handelGetCategory )
categoryRoute.get('/:slug', handelGetSingleCategory )
categoryRoute.put("/update/:slug", isLoggedIn, isAdmin, validateCategory, runValidation, handelUpdateCategory )
categoryRoute.delete('/delete/:slug', handelDeleteCategory )

module.exports = categoryRoute