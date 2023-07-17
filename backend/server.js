const express = require("express");
const mongoose =  require("mongoose");
const bodyparser = require("body-parser");
const passportConfig = require("./lib/passportConfig");
var cors = require("cors");

require("./db/connect");

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true}));
app.use(cors());
app.use(express.json());
app.use(passportConfig.initialize());


app.listen(port, () =>{
    console.log("Server is listening on port "+port)
})
app.use("/auth", require("./routes/authRoutes"));
app.use("/api", require("./routes/apiRoutes"));
