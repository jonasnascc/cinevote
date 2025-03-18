const {DataTypes} = require("sequelize")

const db = require("../db/conn")
const PlaylistItem = require("./PlaylistItem")

const Movie = db.define("Movie", {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tmdbId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
    }
})

Movie.belongsToMany(PlaylistItem, {through: "movie_pos"})

module.exports = Movie