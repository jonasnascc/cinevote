require("dotenv").config()

const jwt = require("jsonwebtoken")

const User = require("../models/User")

const getUserByToken = async (token, res) => {
    if(!token){
        res.status(401).json({error: "Access denied!"})
        return null
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "")
        const user = await User.findOne({where: {id:  decoded.id}})

        if(!user) throw new Error("User not found.")
        return user
    }
    catch(error){
        console.log(error)
        if(error.message == "invalid token") res.status(500).json({message: "Invalid token."})
        else res.status(500).json({message: "Internal server error."})
        return null
    }
}

module.exports = getUserByToken