// uses router and fs for downloading the resume and profile pic

// for downloading file we can also directly use res.download(filePath) provided by express
const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const mongoose = require("mongoose");
const { GridFSBucket } = require("mongodb");
const { Readable } = require("stream");

// router.get("/resume/:file", (req, res) => {
//   console.log("want to download resume");
//   res.sendFile(`${req.params.file}`);
// });

// Endpoint to download the PDF file
router.get("/resume/:filename", async (req, res) => {
  try {
    console.log("Received file ", req.params.filename);
    const db = mongoose.connection.db;

    // Retrieve file metadata from MongoDB
    const bucket = new GridFSBucket(db, { bucketName: "pdfFiles" });

    // Create a writable stream to send the file back to the client
    const downloadStream = bucket.openDownloadStreamByName(req.params.filename);
    downloadStream.pipe(res);
  } catch (error) {
    console.error("Error downloading PDF:", error);
    res.status(500).send("Error downloading PDF.");
  }
});
router.get("/profile/:file", (req, res) => {
  // const address = path.join(__dirname, `../public/${req.params.file}`);
  // fs.access(address, fs.F_OK, (err) => {
  //   if (err) {
  //     res.status(404).json({
  //       message: "File not found",
  //     });
  //     return;
  //   }
  //   res.sendFile(address);
  // });
  res.sendFile(`${req.params.file}`);
});

module.exports = router;
