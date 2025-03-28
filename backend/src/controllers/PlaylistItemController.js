const {Op} = require("sequelize")

const PlaylistItem = require("../models/PlaylistItem")
const Playlist = require("../models/Playlist")

const Movie = require("../models/Movie")
const Vote = require("../models/Vote")
const User = require("../models/User")

const getToken = require("../helpers/get-token")
const getUserByToken = require("../helpers/get-user-by-token")
const { checkPlaylistExists } = require("../helpers/check-exists")


module.exports = class PlaylistItemController {
    static async create(req, res) {
        const user = await getUserByToken(getToken(req), res)
        if(!user) return


        const {position, movieId, movieTmdbId} = req.body

        const {playlistId, inviteCode} = req.params

        if(position < 0) return res.status(522).json({message: "Position can't be less than zero"})
        if(!position) return res.status(522).json({message: "Position can't be null or empty"})
        if(!movieId && !movieTmdbId) return res.status(522)
            .json({message: "You must define the movieId or/and movieTmdbId."})

        const whereArgs = {}
        if(playlistId) whereArgs.id = playlistId
        else if(inviteCode) whereArgs.inviteCode = inviteCode
        const playlist = await Playlist.findOne({
            where: whereArgs,
            include: {model: User, as:"Guests"}
        })

        if(!playlist) return res.status(404).json({message: "Playlist not found."})
        
        const isGuest = (await playlist.getGuests({where: {id: user.id}})).length > 0
        const isOwner = playlist.OwnerId === user.id

        if(!isGuest && !isOwner) return res.status(404).json({message: "Playlist not found."})
        
        const posExists = await PlaylistItem.findOne({where: {position, PlaylistId: playlist.id}})
        if(posExists) return res.status(409)
            .json({message: "There is already a playlist item in this position."})

        const movieInPlaylist = (await PlaylistItem.findAll({where: {PlaylistId: playlist.id, MovieId: movieId}})).length > 0
        if(movieInPlaylist) return res.status(409)
            .json({message: "This movie is already in the playlist."})

        let movie;
        if(movieId) movie = await Movie.findOne({where: {id:movieId}})
        else if(movieTmdbId) movie = await Movie.findOne({where: {tmdbId:movieTmdbId}})

        if(!movie) return res.status(404).json({message: "Movie not found."})

        const item = {
            position,
            PlaylistId: playlist.id,
            MovieId: movie.id,
            UserId: user.id
        }

        const svdItem = await PlaylistItem.create(item)

        return res.status(200).json({message: "Playlist item successfully added.", playlistItem: svdItem})

    }

    static async list(req, res) {
        const user = await getUserByToken(getToken(req), res)
        
        const playlistId = req.params.playlistId

        const playlist = await Playlist.findOne({where:{id:playlistId, OwnerId: user.id}})

        if(!playlist) return res.status(404).json({message: "Playlist not found."})

        const playlistItems = await PlaylistItem.findAll({where: {PlaylistId: playlist.id}})

        return res.status(200).json({playlistItems})
    }

    static async getById(req, res) {
        const user = await getUserByToken(getToken(req), res)
        
        const playlistId = req.params.playlistId
        
        const id = req.params.id

        const playlist = await Playlist.findOne({where:{id:playlistId, OwnerId: user.id}})

        if(!playlist) return res.status(404).json({message: "Playlist not found."})

        const playlistItem = await PlaylistItem.findOne({where: {id, PlaylistId: playlist.id}})

        if(!playlistItem) return res.status(404).json({message: "Playlist item not found."})

        return res.status(200).json({playlistItem})
    }

    static async delete(req, res) {
        const user = await getUserByToken(getToken(req), res)
        
        const playlistId = req.params.playlistId

        const playlist = await Playlist.findOne({where:{id:playlistId, OwnerId: user.id}})

        if(!playlist) return res.status(404).json({message: "Playlist not found."})

        const id = req.params.id

        const playlistItem = await PlaylistItem.findOne({where: {id, PlaylistId: playlist.id}})

        if(!playlistItem) return res.status(404).json({message: "Playlist item not found."})

        const delRows = await PlaylistItem.destroy({where: {id: playlistItem.id}})

        if(delRows==0) return res.status(500).json({message: "Internal server error, not able to delete playlist item."})

        return res.status(200).json({message: "Playlist item successfully deleted."})
    }

    static async update(req, res) {
        const user = await getUserByToken(getToken(req), res)

        const {position, movieId, movieTmdbId, playlistId:plistId} = req.body

        const playlistId = req.params.playlistId

        if(position < 0) return res.status(522).json({message: "Position can't be less than zero"})
        if(!movieId && !movieTmdbId) return res.status(522).json({message: "You must define the movieId or/and movieTmdbId."})

        const playlist = await Playlist.findOne({where:{id:playlistId, OwnerId: user.id}})

        if(!playlist) return res.status(404).json({message: "Playlist not found."})

        const id = req.params.id

        const playlistItem = await PlaylistItem.findOne({where: {id, PlaylistId: playlist.id}})

        if(!playlistItem) return res.status(404).json({message: "Playlist item not found."})

        const movieInPlaylist = (await PlaylistItem.findAll({where: {id :{[Op.ne]:[id]}, PlaylistId: playlist.id, MovieId: movieId}})).length > 0
        if(movieInPlaylist) return res.status(409).json({message: "This movie is already in the playlist."})

        let movie;

        if(movieId) movie = await Movie.findOne({where: {id:movieId}})
        else if(movieTmdbId) movie = await Movie.findOne({where: {tmdbId:movieTmdbId}})

        if(!movie) return res.status(404).json({message: "Movie not found."})

        PlaylistItem.update({
            position: position ?? playlistItem.position,
            MovieId : movie ? movie.id : playlistItem.MovieId,
            PlaylistId: plistId ?? playlistItem.PlaylistId
        })

        return res.status(200).json({message: "Playlist item successfully updated."})
        
    }

    static async updatePlaylistItemPosition(req, res) {
        const user = await getUserByToken(getToken(req), res)

        const {position, switchPositions} = req.body
        
        if(position < 0) return res.status(522).json({message: "Position can't be less than zero"})

        const playlistId = req.params.playlistId

        const playlist = await Playlist.findOne({where:{id:playlistId, OwnerId: user.id}})

        if(!playlist) return res.status(404).json({message: "Playlist not found."})

        const id = req.params.id

        const playlistItem = await PlaylistItem.findOne({where: {id, PlaylistId: playlist.id}})

        if(!playlistItem) return res.status(404).json({message: "Playlist item not found."})

        const existentItem = await PlaylistItem.findOne({where: {position, PlaylistId: playlist.id}})
        if(existentItem){
            if(switchPositions) {
                await existentItem.update({position: playlistItem.position})
            }
            else return res.status(409).json({message: "This position already has an item."})
        }

        const item = await playlistItem.update({position: position})

        return res.status(200).json({message: "Playlist item position successfully updated.", playlistItem: item})
    }

    static async changePlaylist(req, res) {
        const user = await getUserByToken(getToken(req), res)

        const playlistId = req.params.playlistId
        const playlist = await Playlist.findOne({where:{id:playlistId, OwnerId: user.id}})
        if(!playlist) return res.status(404).json({message: "Playlist not found."})

        const newPlaylistId = req.body.playlistId
        const newPlaylist = await Playlist.findOne({where:{id:newPlaylistId, OwnerId: user.id}})
        if(!newPlaylist) return res.status(404).json({message: "New playlist not found."})

        const id = req.params.id

        const playlistItem = await PlaylistItem.findOne({where: {id, PlaylistId: playlist.id}})

        if(!playlistItem) return res.status(404).json({message: "Playlist item not found."})

        const movieInPlaylist = (await PlaylistItem.findAll({where: {PlaylistId: newPlaylist.id, MovieId: playlistItem.MovieId}})).length > 0
        if(movieInPlaylist) return res.status(409).json({message: "This playlist item's movie is already in the playlist."})

        const item = await playlistItem.update({PlaylistId: newPlaylist.id})

        return res.status(200).json({message: "Playlist item position successfully updated.", playlistItem: item})
    }

    static async vote(req, res) {
        const user = await getUserByToken(getToken(req), res)
        
        const {playlistId, id, val}= req.params

        const isPositive = parseInt(val)

        if(isPositive !== 0 && isPositive !== 1) return res.status(522).json({message: "Vote value can only be 0 or 1."})

        const playlist = await Playlist.findOne({where:{id:playlistId, OwnerId: user.id}})

        if(!playlist) return res.status(404).json({message: "Playlist not found."})

        const playlistItem = await PlaylistItem.findOne({where: {id, PlaylistId: playlist.id}})

        if(!playlistItem) return res.status(404).json({message: "Playlist item not found."})

        let vote = await Vote.findOne({where: {OwnerId:user.id, PlaylistItemId: playlistItem.id}});
        
        if(vote) await vote.update({isPositive})

        else await Vote.create({isPositive, OwnerId:user.id, PlaylistItemId: playlistItem.id})
        
        return res.status(200).json({message: "Vote submited."})
    }
}