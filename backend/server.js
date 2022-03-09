const express = require('express')
const app = express()

const routes = require('./routes/routes')
const cors = require('cors')



app.use(express.json());
app.use(cors());
app.use('/tweet',routes); // set the routes
app.listen(process.env.PORT || 4000, () => console.log("server is running")); //listen on port 4000

