const mongoose = require("mongoose");
const connectionURL = "mongodb://localhost:27017/";
mongoose
  .connect(connectionURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB Connection Done");
  })
  .catch((e) => {
    console.log(e);
  });
