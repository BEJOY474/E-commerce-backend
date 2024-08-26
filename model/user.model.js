const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const saltRounds = 10


const config = require('../config/config')

const clientUrl = config.Upload_image.imgUrl

const userScheema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "User name is required"],
        trim: true,
        minlength: [3, "Name is too short. Need minimum 3 characters"],
        maxlength: [31, "Name is too long. Need minimum 31 characters"]
    },
    email: {
        type: String,
        required: [true, "User email is required"],
        unique: true,
        lowercase: true,
        validate: {
            validator: function (v) {
                return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v)
            },
            message: props => `${props.value} is not a valid email address!`
        },
    },
    password: {
        type: String,
        required: [true, "User password is required"],
        minlength: [6, "Password is too short. Need minimum 6 characters"],
        set: (v) => bcrypt.hashSync(v, saltRounds)
    },
    image: {
        type: String,
        default: clientUrl
        // type: Buffer,
        // contentType: String,
        // required: [true, 'User image is required']
    },
    address: {
        type: String,
        required: [true, "User address is required"],
        minlength: [3, "address is too short. Need minimum 3 characters"]
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    isBanned: {
        type: Boolean,
        default: false
    },
    createAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true // ey line er maddhone bujha jabe kon user kobe register korse, kobe update korse info
})

exports.User = mongoose.model(
    "Users",
    userScheema
)