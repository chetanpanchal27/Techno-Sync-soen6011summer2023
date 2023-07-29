const express = require("express");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const passportConfig = require("./lib/passportConfig");
const fs = require("fs");
var cors = require("cors");

require("./db/connect");

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());
app.use(passportConfig.initialize());

app.listen(port, () => {
  console.log("Server is listening on port " + port);
});

// initialising directories
if (!fs.existsSync("./uploads")) {
  fs.mkdirSync("./uploads");
}
if (!fs.existsSync("./uploads/resume")) {
  fs.mkdirSync("./uploads/resume");
}
if (!fs.existsSync("./uploads/profile")) {
  fs.mkdirSync("./uploads/profile");
}

app.use("/auth", require("./routes/authRoutes"));
app.use("/api", require("./routes/apiRoutes"));
app.use("/upload", require("./routes/uploadRoutes"));
app.use("/host", require("./routes/downloadRoutes"));
