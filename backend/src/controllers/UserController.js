require("dotenv").config()
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const {Op} = require("sequelize")

const User = require("../models/User")

const createUserToken = require("../helpers/create-user-token")
const getToken = require("../helpers/get-token")

module.exports = class UserController {
    static async register(req, res) {
        let missingKeys = []

        const {
            username, email, password, passwordConfirm
        } = req.body;

        if(!username) missingKeys.push("username");
        if(!email) missingKeys.push("email");
        if(!password) missingKeys.push("password");
        if(!passwordConfirm) missingKeys.push("passwordConfirm");
        
        if(missingKeys.length > 0) {
            res.status(422)
                .json({message: `The following properties can't be null or empty: [${missingKeys.join(", ")}]`})
            return 
        }

        const userExists = await User.findOne({
            where: {
                [Op.or]: [
                    { email: email },
                    { username: username }
                ]
            }
        });

        if (userExists) {
            res.status(422).json({ message: 'Please, use another email and/or username!' })
            return
        }

            
        if (password != passwordConfirm) {
            res.status(422)
                .json({ message: 'Password and passwordConfirm must be equal!' })
            return
        }

        const salt = await bcrypt.genSalt(12)
        const passwordHash = await bcrypt.hash(password, salt)

        try {
            const user = await User.create({username, email, password: passwordHash})
            await createUserToken(user, req, res)
            return 
        } catch(err) {
            console.log(err)
            res.status(500)
                .json({message: "Server error, unable to register user."})
            return 
        }
    }

    static async login(req, res) {
        const {login, password} = req.body

        if(!login) {
            res.status(422).json({message: "Login can't be null or empty!"})
            return
        }

        if(!password) {
            res.status(422).json({message: "Password can't be null or empty!"})
            return
        }

        const user = await User.findOne({where:{
            [Op.or] : [
                {email: login},
                {username: login}
            ]}})

        if(!user) {
            return res.status(422)
                .json({message: "Invalid login or password!"})
        }

        const checkPassword = await bcrypt.compare(password, user.password)

        if(!checkPassword) {
            return res.status(422)
                .json({message: "Invalid login or password!"})
        }

        await createUserToken(user, req, res)
    }

    static async logout(req, res) {
        res.clearCookie('token')
        res.status(200).send({message:"You are not authenticated anymore"})
    }

    static async checkUser(req, res) {
        let currentUser = null;
        const token = getToken(req)
        if(token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || "")
            
            if(!decoded) {
                res.status(500).json({message: "Server internal error!"})
                return
            }

            currentUser = await User.findOne({
                where:{id:decoded.id},
                attributes: { exclude: ["password"] }
            })

            return res.status(200).send(currentUser)
        }

        return res.status(404).send({message:"User not found"})
    }

    static async getUserById(req, res) {
        
    }

    static async updateUser(req, res) {
        
    }
}