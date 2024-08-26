const jwt = require('jsonwebtoken');

exports.jsonWebToken = (payload, secretKey, expiresIn) => {

    if (typeof payload !== 'object' || !payload) {
        throw new Error("Payload must be a non-empty object");
    }

    if (typeof secretKey !== 'string' || secretKey === "") {
        throw new Error("secretKey must be a non-empty string");
    }

    try {
        const token = jwt.sign({
            payload
        }, secretKey, {
            expiresIn
        })
        return token
    } catch (error) {
        console.error("Faild to signin to JWT : ", error)
        throw error
    }


}