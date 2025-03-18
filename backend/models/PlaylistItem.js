const {DataTypes} = require("sequelize")

const db = require("../db/conn")
const Vote = require("./Vote")

const PlaylistItem = db.define('Playlist_Item', {
    position: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
})

PlaylistItem.hasMany(Vote)

module.exports = PlaylistItem