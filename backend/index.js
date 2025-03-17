const express = require('express')

const app = express()

const conn = require('./db/conn')

app.use(express.json())

app.use(express.static('public'))

const UserRoutes = require('./routes/UserRoutes')
const PlaylistRoutes = require('./routes/PlaylistRoutes')
const PlaylistPosRoutes = require('./routes/PlaylistPosRoutes')
const MovieRoutes = require('./routes/MovieRoutes')
const VoteRoutes = require('./routes/VoteRoutes')

app.use('/users', UserRoutes)
app.use('/playlists', PlaylistRoutes)
app.use('/playlists/positions', PlaylistPosRoutes)
app.use('/movies', MovieRoutes)
app.use('/votes', VoteRoutes)

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