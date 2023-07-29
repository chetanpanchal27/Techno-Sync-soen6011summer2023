const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

require("dotenv").config();
const cloudinary = require("cloudinary");

cloudinary.config({
  cloud_name: "drk6tf65a",
  api_key: "364628933339974",
  api_secret: "_gihdb5iuBuUHjyNoz9Q_evwZXg",
});

const router = express.Router();

var storage = multer.diskStorage({});
var upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    console.log("In File Filter");
    let ext = path.extname(file.originalname);
    if (ext == ".jpg" || ext == ".png" || ext == ".gif" || ext == ".jpeg") {
      console.log("Extension Check");
      cb(null, true);
    } else {
      cb("Only Images Are Allow", false);
    }
  },
}).single("file");
router.post("/resume", (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      res.status(400).json({
        message: "Error in uploading",
      });
    } else {
      console.log(req.file.size);
      console.log("file recieved" + req.file.originalname);

      if (req.file == undefined) {
        res.status(400).json({
          message: "Error: No File Selected!",
        });
      } else {
        console.log(req.file.path);
        cloudinary.v2.uploader.upload(req.file.path, function (err, result) {
          if (err) {
            res.status(400).json({
              message: "Error: No File Selected!",
            });
          }
          console.log(result.secure_url);
          console.log("file uploaded");
          res.send({
            message: "File uploaded successfully!",
            url: `${result.secure_url}`,
          });
        });
      }
    }
  });
});

router.post("/profile", (req, res) => {
  console.log("Upload Profile -->>>>>>");
  upload(req, res, (err) => {
    if (err) {
      console.log("Errror ", err);
      res.status(400).json({
        message: "Error in uploading",
      });
    } else {
      console.log(req.file.size);
      console.log("file recieved" + req.file.originalname);

      //console.log(req)
      if (req.file == undefined) {
        res.status(400).json({
          message: "Error: No File Selected!",
        });
      } else {
        console.log(req.file.path);
        cloudinary.v2.uploader.upload(req.file.path, function (err, result) {
          if (err) {
            res.status(400).json({
              message: "Error: No File Selected!",
            });
          }
          console.log(result.secure_url);
          console.log("file uploaded");
          res.send({
            message: "Image uploaded successfully!",
            url: `${result.secure_url}`,
          });
        });
      }
    }
  });
});

module.exports = router;
