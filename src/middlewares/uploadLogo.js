// middlewares/uploadLogo.js
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadPath = path.join(__dirname, "../../uploads/clinicas");

// Crear carpeta si no existe
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const idClinica = req.params.id;
    const clinicaPath = path.join(uploadPath, idClinica.toString());
    if (!fs.existsSync(clinicaPath)) fs.mkdirSync(clinicaPath, { recursive: true });
    cb(null, clinicaPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `logo-${Date.now()}${ext}`);
  },
});

const uploadLogo = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB máximo
});

module.exports = uploadLogo;