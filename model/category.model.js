const mongoose = require('mongoose')

const categoryScheema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Category name is required"],
        trim: true,
        unique : true,
        minlength: [3, "Category is too short. Need minimum 3 characters"],
        maxlength: [31, "Category is too long. Need minimum 31 characters"]
    },
    
    slug: {
        type: String,
        required: [true, "slug name is required"],
        trim: true,
        unique : true,
        lowercase: true
      
    },
    
    createAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true // ey line er maddhone bujha jabe kon user kobe register korse, kobe update korse info
})

exports.Category = mongoose.model(
    "Category",
    categoryScheema
)