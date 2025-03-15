const express = require('express')

const app = express()

const conn = require('./db/conn')

app.use(express.json())

app.use(express.static('public'))

app.listen(3000, () => {
    console.log("Listening to port 3000...")
})