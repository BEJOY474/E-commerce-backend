require('dotenv').config()

const dev = {
    app: {
        port: process.env.SERVER_PORT || 8080
    },
    DB: {
        url: process.env.DB_URL || "mongodb://localhost:27017/E_Commers_Project"
        // url: "mongodb://localhost:27017/eCmrs"
    },
    Secret_key: {
        key: process.env.JWT_ACTIVATION_KEY || "I4JUFGEVF094UJTG5JRJREGV3409IFGIREVJK",
        access_key: process.env.JWT_ACCESS_KEY || "449jjfjwwej333vvREGV3409IFGIREVJK",
        reset_password_key: process.env.JWT_RESET_PASSWORD_KEY || "4u8y733vvREGV3409IFGIREVJK"

    },
    SMTP: {
        userName: process.env.SMTP_USERNAME || '',
        password: process.env.SMTP_PASSWORD || ''
    },
    Client_url: {
        url: process.env.CLIENT_URL || 'http://localhost:3000'
    },
    Upload_image: {
        imgUrl: process.env.UPLOAD_FILE_DIRECTORY || './public/image/user',
        productImgUrl: process.env.UPLOAD_PRODUCT_FILE_DIRECTORY || './public/image/product',
        maxSize: process.env.MAX_FILE_SIZE || '10485760',
        allowFileType: process.env.ALLOWED_FILE_TYPE || ['image/jpg', 'image/png', 'image/jpeg', 'image/JPG']
    }
}

module.exports = dev