const createErro = require('http-errors')
const {
    Product
} = require('../model/products.model')
const slugify = require('slugify')
const { deleteImage } = require('../src/helper/deleteImage')

exports.creteProduct = async (name,
    description,
    price,
    quantity,
    sold,
    shipping,
    image,
    category) => {


    if (image && image.size > 1024 * 1024 * 5) {
        throw createErro(400, 'File is too large. File should be less then 5MB')
    }

    const productExsists = await Product.exists({
        name
    })

    if (productExsists) {
        throw createErro(409, "This product is already exsists!.")
    }

    const newProduct = await Product.create({
        name: name,
        slug: slugify(name),
        description: description,
        price: price,
        quantity: quantity,
        sold: sold,
        image: image,
        shipping: shipping,
        category: category
    })

    if (!newProduct) {
        throw createErro(409, "This product not create!.")
    }

    return newProduct
}

exports.getAllProduct = async (page, limit) => {

    const products = await Product.find({}).populate('category').limit(limit).skip((page - 1) * limit)

    const count = await Product.find().countDocuments()
    if (!products) throw createErro(404, "No product found!")

    return {
        products,
        pagination: {
            totalPage: Math.ceil(count / limit),
            currentPage: page,
            previousPage: page - 1 > 0 ? page - 1 : null,
            nextPage: page + 1 <= Math.ceil(count / limit) ? page + 1 : null
        }
    }
}

exports.searchProduct = async (page, limit, search) => {
 
    const searchRegExp = new RegExp(".*" + search + ".*", "i") // mane holo ekta name e fst and last value ja e thak na keno middle er search value mille shei name ta return korbe

    const filter = {
       
        $or: [{
                name: {
                    $regex: searchRegExp
                }
            },
           
        ]
    }

    const products = await Product.find(filter).populate('category').limit(limit).skip((page - 1) * limit)

    const count = await Product.find(filter).countDocuments()
    if (!products) throw createErro(404, "No product found!")

    return {
        products,
        pagination: {
            totalPage: Math.ceil(count / limit),
            currentPage: page,
            previousPage: page - 1 > 0 ? page - 1 : null,
            nextPage: page + 1 <= Math.ceil(count / limit) ? page + 1 : null
        }
    }

}

exports.updateProduct = async (slug , req) => {
    const product = await Product.findOne({slug})

    if (!product) {
        throw createErro(404, "Product not found for update")
    }

    const updateOptions = {
        new: true,
        runValidators: true,
        context: 'query'
    }

    let updates = {}

    const allowedFields =[
        'name', 'description', 'price',
        'quantity', 'sold' , 'shipping'
    ] 

    for (let key in req.body) {
        if (allowedFields.includes(key)) {
            updates[key] = req.body[key]
        }
       
    }

    if(updates.name){
        updates.slug = slugify(updates.name)
    }

    const image = (req.file?.path)

    if(image){
        if (image.size > 1024 * 1024 * 5) {
            throw createErro(400, 'File is too large. File should be less then 5MB')
        }
        updates.image = image
        deleteImage(product.image)
    }
  

    const updateProduct = await Product.findOneAndUpdate({slug}, updates, updateOptions)

    if (!updateProduct) {
        throw createErro(404, "Product update faild")
    }

    return updateProduct
}

exports.deleteProduct = async (slug) => {
    const products = await Product.findOne({slug})
    if (!products) throw createErro(404, "No product found!")

        if(products.image){
            await deleteImage(products.image) //deleteImage.js theke call kora hoise image delete korar jonno
        }

    return await Product.findOneAndDelete({slug})

}