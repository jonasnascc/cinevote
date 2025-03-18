const bcrypt = require("bcrypt")

const User = require("../models/User")

const createUserToken = require("../helpers/create-user-token")

module.exports = class UserController {
    static async register(req, res) {
        let missingKeys = []

        const {
            name, email, password, passwordConfirm
        } = req.body;

        if(!name) missingKeys.push("name");
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
                email : email
            }
        })

        if (userExists) {
            res.status(422).json({ message: 'Please, use another email!' })
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
            const user = await User.create({name, email, password: passwordHash})
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
        
    }

    static async checkUser(req, res) {
        
    }

    static async getUserById(req, res) {
        
    }

    static async updateUser(req, res) {
        
    }
}