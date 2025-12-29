const multer = require("multer");
const path = require("path");

//image storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    const randomText = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = file.originalname.split(".").pop();
    cb(null, file.fieldname + "-" + randomText + "." + extension);
  },
});

//File type validation
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif|webp|avif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(
      "Error: Only image files are allowed! (jpeg, jpg, png, gif, webp, avif)"
    );
  }
}

//Multer upload
const upload = multer({
  storage,
  limits: { fileSize: 2000000 }, // 2MB
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

module.exports = upload;
