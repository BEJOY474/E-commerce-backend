const userData = require('../model/data.json')
const products = require('../model/productData2.json')
const { Product } = require('../model/products.model')

const {
    User
} = require('../model/user.model')

exports.seedUser = async (req, res, next) => {
    try {
        //delete all of users
        await User.deleteMany({})

        //user insert
        const users = await User.insertMany(userData)
        return res.status(200).send({
            success: true,
            users
        })
    } catch (error) {
        next(error)
    }
}

exports.seedProducts = async (req, res, next) => {
    try {
        //delete all of users
        await Product.deleteMany({})

        //user insert
        const productss = await Product.insertMany(products)
        return res.status(200).send({
            success: true,
            productss
        })
    } catch (error) {
        next(error)
    }
}