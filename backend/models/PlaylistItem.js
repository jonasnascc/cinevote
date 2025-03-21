const {DataTypes} = require("sequelize")

const db = require("../db/conn")
const Vote = require("./Vote")
const User = require("./User")

const PlaylistItem = db.define('Playlist_Item', {
    position: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
})

PlaylistItem.hasMany(Vote)
PlaylistItem.belongsTo(User)

module.exports = PlaylistItem