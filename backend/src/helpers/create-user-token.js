require("dotenv").config()

const jwt = require("jsonwebtoken")

const createUserToken = async (user, req, res) => {
    const token = jwt.sign(
        {
            name: user.name,
            id: user.id
        },
        process.env.JWT_SECRET
    )

    res.cookies('token', token, {
        httpOnly: true,
        sameSite: 'lax',
    })

    res.status(200).json({
        message: "You are authenticated!",
        userId: user.id
    })
}

module.exports = createUserToken;