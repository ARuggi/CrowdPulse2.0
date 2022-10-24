const express = require("express");
const cors = require("cors");
const tweetRoute = require("./routes/tweetRoutes");

const app = express();
app.use(express.json());
app.use(cors());

// set the routes.
app.use("/tweet", tweetRoute);
//app.use("/endpoint", endpointRoute);

// listen on port 4000 by default.
app.listen(
    process.env.PORT || 4000,
    () => console.log("server is running"));

