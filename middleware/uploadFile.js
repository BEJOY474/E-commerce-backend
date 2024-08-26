//string image

const createErro = require('http-errors')
const multer = require('multer')
const path = require('path')
const config = require('../config/config')
const {
    error
} = require('console')


const UPLOAD_DIR = config.Upload_image.imgUrl
const maxSize = Number(config.Upload_image.maxSize)
const allowFileType = config.Upload_image.allowFileType

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOAD_DIR)
    },
    filename: (req, file, cb) => {
        const extName = path.extname(file.originalname)
        cb(null, Date.now() + '-' + file.originalname.replace(extName, '') + extName)
    }
})

const fileFilter = (req, file, cb) => {
    const extName = path.extname(file.originalname)

    if (!allowFileType.includes(extName.substring(1))) {
        return cb(new Error("File type is not supported"), false)
    }

    cb(null, true)
}

exports.upload = multer({
    storage: storage,
    // limits: {
    //     fileSize: maxSize
    // },
    fileFilter

})




//Buffer image

// const createErro = require('http-errors')
// const multer = require('multer')
// const path = require('path')
// const config = require('../config/config')
// const {
//     error
// } = require('console')


// const UPLOAD_DIR = config.Upload_image.imgUrl
// const maxSize = Number(config.Upload_image.maxSize)
// const allowFileType = config.Upload_image.allowFileType

// const storage = multer.memoryStorage()

// const fileFilter = (req, file, cb) => {
//     if (!file.mimetype.startsWith("image/")) {
//         return cb(new Error('Only image file are allowed'), false)
//     }
// }

// exports.upload = multer({
//     storage: storage,
//     // limits: {
//     //     fileSize: maxSize
//     // },
//     fileFilter

// })