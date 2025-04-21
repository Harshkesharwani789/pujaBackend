import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let dir = "uploads/others"; // default folder

    if (req.originalUrl.includes("/products")) {
      dir = "uploads/products";
    } else if (req.originalUrl.includes("/categories")) {
      dir = "uploads/categories";
    }

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const upload = multer({ storage });

export default upload;
