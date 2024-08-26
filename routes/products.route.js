const express = require('express')
const { handleCreatProduct, handleGetAllProduct, handleSearchProduct, handleDeleteProduct, handelUpdateProduct } = require('../controllers/product.controller')
const { uploadProductFiles } = require('../middleware/uploadProductFile')
const { isLoggedIn, isAdmin } = require('../middleware/auth')
const { validatesProduct } = require('../src/validator/productAuth')
const { runValidation } = require('../src/validator')

const productsRouter = express.Router()

productsRouter.post("/create", isLoggedIn, isAdmin , uploadProductFiles.single("image"), handleCreatProduct)
productsRouter.get("/" , handleGetAllProduct)
productsRouter.get('/search', handleSearchProduct )
productsRouter.delete('/delete/:slug',isLoggedIn, isAdmin, handleDeleteProduct )
productsRouter.put('/update/:slug',isLoggedIn, isAdmin, uploadProductFiles.single("image"), handelUpdateProduct)


module.exports = productsRouter