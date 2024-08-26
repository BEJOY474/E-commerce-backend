const fs = require('fs').promises

exports.deleteImage = async (imagePath) => {
    try {
        await fs.access(imagePath)
        await fs.unlink(imagePath)
        console.log("Image has been deleted")
    } catch (error) {
        console.error("Image doesn't exixt")
    }

}