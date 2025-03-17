const {DataTypes} = require("sequelize")

const db = require("../db/conn")
const PlaylistPos = require("./PlaylistPos")

const Movie = db.define("Movie", {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tmdbId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
})

Movie.belongsToMany(PlaylistPos, {through: "movie_pos"})

module.exports = Movie