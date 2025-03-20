const getToken = require("../helpers/get-token")
const getUserByToken = require("../helpers/get-user-by-token")
const genAlphanumeric = require("../helpers/gen-alpha-numeric")

const Playlist = require("../models/Playlist")
const e = require("express")

module.exports = class PlaylistController {
    static async create(req, res) {
        const user = await getUserByToken(getToken(req), res)

        const {name, maxDuration, maxSize, isPublic} = req.body

        if(!name) return res.status(522).json({message: "Name can't be null or empty!"})

        const inviteCode = genAlphanumeric(12)

        const playlist = {
            name,
            maxDuration,
            maxSize,
            inviteCode,
            isRunning: false,
            isPublic: isPublic ?? false,
            UserId: user.id
        }
        
        try {
            const svdPlaylist = await Playlist.create(playlist)
            res.status(200)
                .json({
                    message: "Playlist created successfully.",
                    playlist: {id: svdPlaylist.id, ...playlist}
                })
            return 
        } catch(err) {
            console.log(err)
            res.status(500)
                .json({message: "Server error, unable to create playlist."})
            return 
        }

    }

    static async list(req, res) {
        const user = await getUserByToken(getToken(req), res)

        const playlists = await Playlist.findAll({where: {
            UserId : user.id
        }})

        return res.status(200).json({playlists})
    }

    static async listByUser(req, res) {
        const {userId:UserId} = req.params

        const playlists = await Playlist
            .findAll({
                where: {UserId, isPublic:true},
                attributes: { exclude: ["id", "UserId", 'createdAt', 'updatedAt'] }
            })

        return res.status(200).json({playlists})
    }

    static async getById(req, res) {
        const id = req.params.id

        const user = await getUserByToken(getToken(req), res)

        const playlist = await Playlist.findOne({
            where:{id, UserId: user.id}
        })

        if(!playlist) return res.status(404).json({message: "Playlist not found."})

        return res.status(200).json({playlist})
    }

    static async getByInviteCode(req, res) {
        const user = await getUserByToken(getToken(req), res)
        
        const inviteCode = req.params.inviteCode

        const playlist = await Playlist
            .findOne({
                where:{inviteCode, isPublic:true},
                attributes: { exclude: ["id", "UserId", 'createdAt', 'updatedAt'] }
            })

        if(!playlist) return res.status(404).json({message: "Playlist not found."})

        return res.status(200).json({playlist})
    }

    static async delete(req, res) {
        const id = req.params.id

        const user = await getUserByToken(getToken(req), res)

        const playlist = await Playlist.findOne({
            where:{id, UserId: user.id}
        })

        if(!playlist) return res.status(404).json({message: "Playlist not found."})
        
        const delRows = await Playlist.destroy({where: {id, UserId: user.id}})
        
        if(delRows == 0) return res.status(500).json({message: "Internal server error, not able to delete playlist."})
        
        return res.status(200).json({message : "Playlist deleted successfully."})
    }

    static async update(req, res) {
        const id = req.params.id

        const user = await getUserByToken(getToken(req), res)

        const svdPlaylist = await Playlist.findOne({
            where:{id, UserId: user.id}
        })

        if(!svdPlaylist) return res.status(404).json({message: "Playlist not found."})

        const {name, maxDuration, maxSize, isPublic, isRunning} = req.body

        if(name == "") return res.status(522).json({message: "Name can't be empty!"})

        const playlist = {
            name: name,
            maxDuration: maxDuration ?? svdPlaylist.maxDuration,
            maxSize: maxSize ?? svdPlaylist.maxSize,
            isPublic: isPublic ?? svdPlaylist.isPublic,
            isRunning: isRunning ?? svdPlaylist.isRunning
        }
        
        await svdPlaylist.update(playlist)
        
        return res.status(200).json({message : "Playlist updated successfully."})
    }
}