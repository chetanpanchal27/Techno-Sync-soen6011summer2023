dbPassword =
  "mongodb+srv://kapadiyaurvish16:Urvish1234@cluster0.zmz26ki.mongodb.net/?retryWrites=true&w=majority";

const mongoose = require("mongoose");
mongoose
  .connect(dbPassword, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB Connection Done");
  })
  .catch((e) => {
    console.log(e);
  });
