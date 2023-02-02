const multer = require("multer");
const DIR = '../assets/uploads/';
const path = require('path')

const photosFilter = (req, file, cb) => {
  // if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg" || file.mimetype == "application/pdf") {
    cb(null, true);
  // } else {
  //   cb("Please upload only png/jpg/jpeg file.", false);
  // }
};

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, DIR));
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

var uploadFile = multer({ storage: storage, fileFilter: photosFilter });

module.exports = { uploadFile };