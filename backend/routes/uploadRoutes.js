const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");
const { GridFSBucket } = require("mongodb");
const { Readable } = require("stream");
const { v4: uuidv4 } = require("uuid");
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

// Set up Multer for file upload
const resumeStorage = multer.memoryStorage();
const uploadResume = multer({ storage: resumeStorage });

// Endpoint to handle file upload
router.post("/resume", uploadResume.single("file"), async (req, res) => {
  try {
    const db = mongoose.connection.db;

    // Now you can use the db object for other MongoDB operations
    // For example, to create a GridFS bucket:
    const bucket = new mongoose.mongo.GridFSBucket(db, {
      bucketName: "pdfFiles",
    });
    console.log("GridFS bucket created");
    const uniqueNumber = uuidv4();
    const originalFilename = req.file.originalname;
    const filenameWithUniqueNumber = `${uniqueNumber}_${originalFilename}`;
    // Create a readable stream from the uploaded file buffer
    const readableStream = new Readable();
    readableStream.push(req.file.buffer);
    readableStream.push(null);

    // Upload the file to MongoDB GridFS bucket
    const uploadStream = bucket.openUploadStream(filenameWithUniqueNumber);
    readableStream.pipe(uploadStream);

    res.send({
      url: filenameWithUniqueNumber,
      message: "File uploaded successfully",
    });
  } catch (error) {
    console.error("Error uploading PDF:", error);
    res.status(500).send("Error uploading PDF.");
  }
});
// router.post("/resume", (req, res) => {
//   upload(req, res, (err) => {
//     if (err) {
//       res.status(400).json({
//         message: "Error in uploading",
//       });
//     } else {
//       console.log(req.file.size);
//       console.log("file recieved" + req.file.originalname);

//       if (req.file == undefined) {
//         res.status(400).json({
//           message: "Error: No File Selected!",
//         });
//       } else {
//         console.log(req.file.path);
//         cloudinary.v2.uploader.upload(req.file.path, function (err, result) {
//           if (err) {
//             res.status(400).json({
//               message: "Error: No File Selected!",
//             });
//           }
//           console.log(result.secure_url);
//           console.log("file uploaded");
//           res.send({
//             message: "File uploaded successfully!",
//             url: `${result.secure_url}`,
//           });
//         });
//       }
//     }
//   });
// });

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
