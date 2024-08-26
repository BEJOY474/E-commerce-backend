const createHttpError = require("http-errors")
const {
    Category
} = require("../model/category.model")
const {
    creteCategory,
    getCategory,
    getSingleCategory,
    updateCategory,
    deleteCategory
} = require("../services/categoryServices")
const {
    successResponse
} = require("./errorSuccess.controller")


exports.handelCreteCategory = async (req, res, next) => {
    try {

        const {
            name
        } = req.body

        const newCategory = await creteCategory(name)

        return successResponse(res, {
            statusCode: 203,
            message: "Category is added successfully",
            payload: {
                newCategory
            }
        })

    } catch (error) {
        next(error)
    }
}

exports.handelGetCategory = async (req, res, next) => {
    try {

        const categories = await getCategory()

        return successResponse(res, {
            statusCode: 203,
            message: "Category has fetched successfully",
            payload: {
                categories
            }
        })

    } catch (error) {
        next(error)
    }
}

exports.handelGetSingleCategory = async (req, res, next) => {
    try {

        const {
            slug
        } = req.params

        const category = await getSingleCategory(slug)
        if (!category) {
            throw createHttpError(404, "Category not found");
        }
        return successResponse(res, {
            statusCode: 203,
            message: "Category has returned successfully",
            payload: {
                category
            }
        })

    } catch (error) {
        next(error)
    }
}

exports.handelUpdateCategory = async (req, res, next) => {
    try {

        const {
            name
        } = req.body

        const {
            slug
        } = req.params


        const update_category = await updateCategory(name, slug)

        if (!updateCategory) {
            throw createHttpError(404, "Category was not update");
        }

        return successResponse(res, {
            statusCode: 203,
            message: "Category is update successfully",
            payload: {
                update_category
            }
        })

    } catch (error) {
        next(error)
    }
}

exports.handelDeleteCategory = async (req, res, next) => {
    try {
        const {
            slug
        } = req.params

        const delete_category = await deleteCategory(slug)

        if (!delete_category) {
            throw createHttpError(404, "Category was not found");
        }

        return successResponse(res, {
            statusCode: 203,
            message: "Category is delete successfully",
           
        })

    } catch (error) {
        next(error)
    }
}