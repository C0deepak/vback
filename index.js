const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')

var cors = require("cors");
app.use(cors());

const dotnev = require('dotenv')
dotnev.config({ path: './config.env' })

const mongoose = require("mongoose")
require('./database/connection')

app.use(express.json())
app.use(cookieParser())

const user = require('./routes/userRoute')
app.use('/api/v1', user)

const PORT = process.env.PORT

app.listen(PORT, (err) => {
    console.log(`App is running at PORT : ${PORT}`)
})