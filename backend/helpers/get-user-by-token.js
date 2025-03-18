require("dotenv").config()

const jwt = require("jsonwebtoken")

const User = require("../models/User")

const getUserByToken = async (token, res) => {
    if(!token) return res.status(401).json({error: "Access denied!"})

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "")

    const user = await User.findOne({where: {id:  decoded.id}})

    return user
}

module.exports = getUserByToken