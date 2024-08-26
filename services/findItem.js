const mongoose = require("mongoose")

const createErro = require('http-errors')

exports.findWithId = async (Model, id, option = {}) => {
    try {
        const item = await Model.findById(id, option)
        if (!item) throw createErro(404, `${Model.modelName} dosen't exist`)
        return item
    } catch (error) {
        if (error instanceof mongoose.Error) {
            throw createErro(404, `${Model.modelName} dosen't exist`)
        }
        throw (error)
    }

}