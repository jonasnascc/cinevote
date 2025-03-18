const {DataTypes} = require("sequelize")

const db = require("../db/conn")
const PlaylistItem = require("./PlaylistItem")
const User = require("./User")

const Playlist = db.define('Playlist', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    inviteCode: {
        type: DataTypes.STRING,
        unique: true
    },
    isPublic: {
        type: DataTypes.BOOLEAN,
    },
    maxDuration: {
        type: DataTypes.STRING,
    },
    maxSize: {
        type: DataTypes.INTEGER,
    },
    isRunning: {
        type: DataTypes.BOOLEAN,
    },
})

Playlist.hasMany(PlaylistItem)
Playlist.belongsTo(User)

User.hasMany(Playlist)

module.exports = Playlist