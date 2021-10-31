const express = require('express')
const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const routes = require('./routes/routes')
const cors = require('cors')

dotenv.config()

mongoose.connect(process.env.DATABASE_ACCES, () => console.log("DB connesso"))

app.use(express.json())
app.use(cors())
app.use('/tweet',routes)
app.listen(4000, () => console.log("server is running"))

