const getToken = require("../helpers/get-token")
const getUserByToken = require("../helpers/get-user-by-token")
const genAlphanumeric = require("../helpers/gen-alpha-numeric")

const Playlist = require("../models/Playlist")
const e = require("express")
const User = require("../models/User")

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
            OwnerId: user.id
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
            OwnerId : user.id
        }})

        return res.status(200).json({playlists})
    }

    static async listByUser(req, res) {
        const {userId:OwnerId} = req.params

        const playlists = await Playlist
            .findAll({
                where: {OwnerId, isPublic:true},
                attributes: { exclude: ["id", "OwnerId", 'createdAt', 'updatedAt'] }
            })

        return res.status(200).json({playlists})
    }

    static async getById(req, res) {
        const id = req.params.id

        const user = await getUserByToken(getToken(req), res)

        const playlist = await Playlist.findOne({
            where:{id, OwnerId: user.id}
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
                attributes: { exclude: ["id", "OwnerId", 'createdAt', 'updatedAt'] }
            })

        if(!playlist) return res.status(404).json({message: "Playlist not found."})

        return res.status(200).json({playlist})
    }

    static async delete(req, res) {
        const id = req.params.id

        const user = await getUserByToken(getToken(req), res)

        const playlist = await Playlist.findOne({
            where:{id, OwnerId: user.id}
        })

        if(!playlist) return res.status(404).json({message: "Playlist not found."})
        
        const delRows = await Playlist.destroy({where: {id, OwnerId: user.id}})
        
        if(delRows == 0) return res.status(500).json({message: "Internal server error, not able to delete playlist."})
        
        return res.status(200).json({message : "Playlist deleted successfully."})
    }

    static async update(req, res) {
        const id = req.params.id

        const user = await getUserByToken(getToken(req), res)

        const svdPlaylist = await Playlist.findOne({
            where:{id, OwnerId: user.id}
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

    static async join(req, res) {
        const user = await getUserByToken(getToken(req), res)
        
        const inviteCode = req.params.inviteCode

        const playlist = await Playlist
            .findOne({where:{inviteCode, isPublic:true}, include: {model: User, as: "Guests"}})

        if(!playlist) return res.status(404).json({message: "Playlist not found."})

        if(playlist.OwnerId == user.id) return res.status(409).json({message: "A user can't join their own playlist."})

        const isJoined = (await playlist.getGuests({where:{id: user.id}})).length > 0
        if(isJoined) return res.status(409).json({message: "User already in this playlist."})

        const add = await playlist.addGuest(user)

        return res.status(200).json({message: "User joined succesfully."})
    }

    static async listGuests(req, res) {
        const user = await getUserByToken(getToken(req), res)
        
        const inviteCode = req.params.inviteCode

        const playlist = await Playlist
            .findOne({where:{inviteCode, isPublic:true}, include: {model: User, as: "Guests"}})

        if(!playlist) return res.status(404).json({message: "Playlist not found."})

        const guestsResp = await playlist.getGuests()
        
        const guests = guestsResp.map(({id, name, email}) => {return {id,name,email}})

        return res.status(200).json({guests})
    }

    static async deleteGuest(req, res) {
        const {id, guestId, inviteCode} = req.params

        const user = await getUserByToken(getToken(req), res)

        let playlist;
        if(id) playlist = await Playlist.findOne({where:{id, OwnerId: user.id}})
        else if(inviteCode) playlist = await Playlist.findOne({where:{inviteCode}})

        if(!playlist) return res.status(404).json({message: "Playlist not found."})

        let guests = await playlist.getGuests({where: {id: inviteCode ? user.id : guestId}})

        if(guests.length === 0) return res.status(404).json({message: "Guest not found."})

        // return res.status(200).json({guest: guests[0]})
        
        await playlist.removeGuests(guests[0])

        return res.status(200).json({message: inviteCode ? "Successfully left the playlist." : "Guest successfully deleted."})
    }
}