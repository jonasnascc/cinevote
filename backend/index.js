const express = require('express')

const app = express()

const conn = require('./db/conn')

const User = require('./models/User')
const Playlist = require('./models/Playlist')
const PlaylistPos = require('./models/PlaylistPos')
const Movie = require('./models/Movie')
const Vote = require('./models/Vote')

app.use(express.json())

app.use(express.static('public'))


conn
    .sync({
        // force: true
    })
    .then(() => {
        app.listen(3000, () => {
            console.log("Listening to port 3000...")
        })        
    })
    .catch((err) => console.log(err))