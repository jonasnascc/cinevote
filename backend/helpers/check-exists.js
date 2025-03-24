const getToken = require("../helpers/get-token")
const getUserByToken = require("../helpers/get-user-by-token")

const Playlist = require("../models/Playlist")

async function checkPlaylistExists(opt, req, res) {
    const {id, inviteCode, owner, public, attributes, include} = opt
    
    const user = await getUserByToken(getToken(req), res)

    const whereArgs = {}

    if(id) whereArgs.id = id
    else if(inviteCode) whereArgs.inviteCode = inviteCode
    if(owner) whereArgs.OwnerId = user.id
    if(public) whereArgs.isPublic = Boolean(public)
    const playlist = await Playlist.findOne({
        where:whereArgs,
        attributes : attributes ?? {},
        include: include
    })

    if(!playlist) {
        res.status(404).json({message: "Playlist not found."})
        return null
    }

    return playlist
}

async function checkPlaylistItemExists(opt, req, res) {

}

module.exports = {
    checkPlaylistExists
}