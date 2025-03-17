const express = require('express')

const app = express()

const port = 8080

const conn = require('./db/conn')


app.use(
    express.urlencoded({
        extended: true,
    }),
)
  
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
        app.listen(port, () => {
            console.log(`Listening to port ${port}...`)
        })        
    })
    .catch((err) => console.log(err))