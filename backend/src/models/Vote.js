const {DataTypes} = require("sequelize")

const db = require("../db/conn")
const User = require("./User")

const Vote = db.define("Vote", {
    isPositive: DataTypes.BOOLEAN,
})

Vote.belongsTo(User)

module.exports = Vote