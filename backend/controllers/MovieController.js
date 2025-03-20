const {Op} = require("sequelize")

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
        const user = getUserByToken(getToken(req), res)

        const movies = await Movie.findAll()

        return res.status(200).json({movies})
    }

    static async getById(req, res) {
        const user = getUserByToken(getToken(req), res)

        const id = req.params.id

        const movie = await Movie.findOne({where: {id}})
        
        if(!movie) res.status(404).json({message: "Movie not found."})
        return res.status(200).json({movie})
    }

    static async delete(req, res) {
        const user = getUserByToken(getToken(req), res)

        const id = req.params.id

        const movie = await Movie.findOne({where: {id}})
        
        if(!movie) res.status(404).json({message: "Movie not found."})

        const delRows = await Movie.destroy({where:{id: movie.id}})

        if(delRows==0) return res.status(500).json({message: "Internal server error, not able to delete movie."})

        return res.status(200).json({message: "Movie deleted successfully."})
    }

    static async update(req, res) {
        const {name, tmdbId} = req.body

        if(!name) return res.status(522).json({message: "Name can't be null or empty"})
        if(!tmdbId) return res.status(522).json({message: "TmdbId can't be null or empty"})
        
        const user = getUserByToken(getToken(req), res)

        const id = req.params.id

        const movie = await Movie.findOne({where: {id}})        
        if(!movie) return res.status(404).json({message: "Movie not found."})

        const movieWithTmdb = await Movie.findOne({where: {tmdbId: tmdbId, id:{[Op.ne]:[movie.id]}}})
        if(movieWithTmdb) return res.status(409).json({message: "Movie already exists with this tmdbId."})

        const updated = await Movie.update({name, tmdbId}, {where: {id:movie.id}})

        if(updated[0] == 0) return res.status(500).json({message: "Internal server error, not able to update movie."})

        return res.status(200).json({message: "Movie updated successfully."})
    }
}