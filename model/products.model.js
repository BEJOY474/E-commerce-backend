const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const config = require('../config/config')

const clientUrl = config.Upload_image.productImgUrl

const productScheema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Product name is required"],
        trim: true,
        unique: [true, 'Product name must be an unique'],
        minlength: [3, "Product is too short. Need minimum 3 characters"],
        maxlength: [150, "Product is too long. Need minimum 150 characters"]
    },

    slug: {
        type: String,
        required: [true, "Slug name is required"],
        trim: true,
        unique: true,
        lowercase: true

    },

    description: {
        type: String,
        required: [true, "Description is required"],
        trim: true,
        unique: [true, "Description must be an unique"],
        minlength: [3, "Description is too short. Need minimum 3 characters"],
        maxlength: [250, "Description is too long. Need minimum 150 characters"]
    },

    price: {
        type: Number,
        required: [true, "Product price is required"],
        validate: {
            validator: (v) => {
                return v > 0
            },
            message: (props) => {
                `${props} is not a valid price! Price must be grether then 0`
            }

        }
    },

    quantity: {
        type: Number,
        required: [true, "Product price is required"],
        validate: {
            validator: (v) => {
                return v > 0
            },
            message: (props) => {
                `${props} is not a valid product quantity!Product quantity must be grether then 0`
            }

        }
    },

    sold: {
        type: Number,
        default : 0,
    },

    shipping: {
        type: Number,
        default : 0
        
    },

    image: {
        type: String,
        default: clientUrl,
        required: [true, "Product image is required"],
    },

    category: {
        type: mongoose.Schema.Types.ObjectId,  // Corrected reference to ObjectId
        ref: 'Category',
        required: [true, "Product category is required"],
    },


    createAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true // ey line er maddhone bujha jabe kon user kobe register korse, kobe update korse info
})

exports.Product = mongoose.model(
    "Product",
    productScheema
)