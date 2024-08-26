const {
    Category
} = require("../model/category.model")

const slugify = require('slugify')


exports.creteCategory = async (name) => {

    const newCategory = await Category.create({
        name: name,
        slug: slugify(name)

    })

    return newCategory
}

exports.getCategory = async () => {

    return await Category.find({ }).select('name slug').lean()

}

exports.getSingleCategory = async (slug) => {
    return await Category.find({slug}).select('name slug').lean()

}

exports.updateCategory = async (name, slug) => {
    const updateCategory = await Category.findOneAndUpdate({slug},
         {$set : {name : name, slug : slugify(name)}}, {new : true})
 
    return updateCategory
}

exports.deleteCategory = async (slug) => {
    return await Category.findOneAndDelete({slug})

}