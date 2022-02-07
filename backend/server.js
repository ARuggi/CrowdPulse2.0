const express = require('express')
const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const routes = require('./routes/routes')
const cors = require('cors')

dotenv.config();

mongoose.connect(process.env.DATABASE_ACCES, () => console.log("DB connesso")); //connect to mongodb using .env

// If the connection throws an error
mongoose.connection.on('error',function (err) {  
    console.log('Mongoose default connection error: ' + err);
  }); 

app.use(express.json());
app.use(cors());
app.use('/tweet',routes); // set the routes
app.listen(process.env.PORT || 4000, () => console.log("server is running")); //listen on port 4000

//DATABASE_ACCES = "mongodb+srv://js:js539@jsmongodb.ayrge.mongodb.net/prova?retryWrites=true&w=majority"