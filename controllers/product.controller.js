const createErro = require('http-errors')
const {
    Product
} = require('../model/products.model')
const slugify = require('slugify')
const {
    successResponse
} = require('./errorSuccess.controller')
const {
    creteProduct,
    getAllProduct,
    searchProduct,
    deleteProduct,
    updateProduct
} = require('../services/productServises')


exports.handleCreatProduct = async (req, res, next) => {
    try {

        const {
            name,
            description,
            price,
            quantity,
            sold,
            shipping,
            category
        } = req.body


        const image = req.file?.path

        const newProduct = await creteProduct(name,
            description,
            price,
            quantity,
            sold,
            shipping,
            image,
            category)
        return successResponse(res, {
            statusCode: 203,
            message: "Product has create successfully",
            payload: {
                newProduct
            }

        })

    } catch (error) {
        next(error)
    }
}

exports.handleGetAllProduct = async (req, res, next) => {
    try {
        //pagination
        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || 2

        const {products, pagination} = await getAllProduct(page, limit)
     
        return successResponse(res, {
            statusCode: 203,
            message: "Product has fetched successfully",
            payload: {
                products, pagination
            }

        })

    } catch (error) {
        next(error)
    }
}

exports.handleSearchProduct = async (req, res, next) => {
    try {
        //pagination
        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || 2

        //search product
        const search = req.query.search || ""

        const {products, pagination} = await searchProduct(page, limit, search)
     
        return successResponse(res, {
            statusCode: 203,
            message: "Product has find successfully",
            payload: {
                products, pagination
            }

        })

    } catch (error) {
        next(error)
    }
}

exports.handleDeleteProduct = async (req, res, next) => {
    try {
        const {slug} = req.params

        await deleteProduct(slug)
        
        return successResponse(res, {
            statusCode: 203,
            message: "Product has delete successfully",
        })

    } catch (error) {
        next(error)
    }
}

exports.handelUpdateProduct = async (req, res, next) => {
    try {

        const {slug} = req.params

        const updateProducts = await updateProduct(slug, req)
     
        return successResponse(res, {
            statusCode: 203,
            message: "Product update is successfully",
            payload: {
                updateProducts
            }
        })

    } catch (error) {
        next(error)
    }
}
