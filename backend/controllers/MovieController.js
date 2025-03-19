const getToken = require("../helpers/get-token")
const getUserByToken = require("../helpers/get-user-by-token")

const Movie = require("../models/Movie")

module.exports = class MovieController {
    static async create(req, res) {
        const {name, tmdbId} = req.body

        if(!name) return res.status(522).json({message: "Name can't be null or empty"})
        if(!tmdbId) return res.status(522).json({message: "TmdbId can't be null or empty"})
        
        const user = getUserByToken(getToken(req), res)

        const movie = await Movie.findOne({where: {tmdbId: tmdbId}})

        if(movie) return res.status(409).json({message: "Movie already exists with this tmdbId."})

        const saved = await Movie.create({name, tmdbId})

        return res.status(200).json({message: "Movie created successfully.", movie: saved})
    }

    static async list(req, res) {
        
    }

    static async getById(req, res) {
        
    }

    static async delete(req, res) {
        
    }

    static async update(req, res) {
        
    }
}