const {DataTypes} = require("sequelize")

const db = require("../db/conn")
const Vote = require("./Vote")

const PlaylistPos = db.define('Playlist_Position', {
    value: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
})

PlaylistPos.hasMany(Vote)

module.exports = PlaylistPos