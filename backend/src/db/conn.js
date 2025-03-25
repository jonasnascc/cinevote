require('dotenv').config()

const {Sequelize} = require('sequelize')

const {DB_HOST, DB_USERNAME, DB_PASSWORD} = process.env

const sequelize = new Sequelize('cinevote_db', DB_USERNAME, DB_PASSWORD, {
    host: DB_HOST,
    dialect: 'mysql'
})

try {
  sequelize.authenticate()
  console.log('Database successfully connected!')
} catch (error) {
  console.error('Database not connected:', error)
}

module.exports = sequelize