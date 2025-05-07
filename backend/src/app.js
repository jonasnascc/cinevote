const express = require('express')
const cookieParser = require("cookie-parser")

const app = express()

const port = 8080

const conn = require('./db/conn')

app.use(cookieParser());

app.use(
    express.urlencoded({
        extended: true,
    }),
)
  
app.use(express.json())

app.use(express.static('public'))

const UserRoutes = require('./routes/UserRoutes')
const PlaylistRoutes = require('./routes/PlaylistRoutes')
const PlaylistItemRoutes = require('./routes/PlaylistItemRoutes')
const MovieRoutes = require('./routes/MovieRoutes')

app.use('/users', UserRoutes)
app.use('/playlists', PlaylistRoutes)
app.use('/playlists', PlaylistItemRoutes)
app.use('/movies', MovieRoutes)

async function startServer() {
    await conn
        .sync({
            // force: true
        })
        .then(() => {
            app.listen(port, () => {
                console.log(`Listening to port ${port}...`)
            })
        })
        .catch((err) => console.log(err))
}

module.exports = {
    app,
    conn,
    startServer
}