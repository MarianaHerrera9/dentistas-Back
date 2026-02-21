// middlewares/uploadLogo.js
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ruta fija para todos los logos
const uploadPath = path.join(__dirname, "../../uploads/logos");

// Crear carpeta si no existe
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath); // Siempre guarda en uploads/logos
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `logo-${Date.now()}${ext}`); // Nombre único por timestamp
  },
});

const uploadLogo = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB máximo
});

module.exports = uploadLogo;