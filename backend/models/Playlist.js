const {DataTypes} = require("sequelize")

const db = require("../db/conn")
const PlaylistPos = require("./PlaylistPos")

const Playlist = db.define('Playlist', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    inviteCode: {
        type: DataTypes.STRING,
        allowNull: false
    },
    isPublic: {
        type: DataTypes.BOOLEAN,
        allowNull: false
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

Playlist.hasMany(PlaylistPos)

module.exports = Playlist