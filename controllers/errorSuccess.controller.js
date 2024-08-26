exports.errorResponse = (res, {
    statusCode = 500,
    message = "Internal Server Error"
}) => {

    return res.status(statusCode).send({
        success: false,
        message
    })

}

exports.successResponse = (res, {
    statusCode = 200,
    message = "Success",
    payload = {}
}) => {

    return res.status(statusCode).send({
        success: true,
        message,
        payload
    })

}