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

Playlist.belongsTo(User, { as: "Owner", foreignKey: "OwnerId" });

User.hasMany(Playlist, { as: "OwnedPlaylists", foreignKey: "OwnerId" });

Playlist.belongsToMany(User, { through: "UserPlaylist", as: "Guests" });
User.belongsToMany(Playlist, { through: "UserPlaylist", as: "GuestPlaylists" });

Playlist.hasMany(PlaylistItem);

module.exports = Playlist