const multer = require("multer");
const path = require("path");
const fs = require("fs");

// 📂 Carpeta absoluta donde se guardarán los archivos
// Esto apunta a /app/uploads dentro del contenedor
const uploadPath = path.join(__dirname, "../../uploads");

// Crear la carpeta si no existe
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

// Configuración de almacenamiento de Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        // Reemplaza espacios por guiones y genera un nombre único
        const safeName = file.originalname.replace(/\s+/g, "-");
        const uniqueName = `${Date.now()}-${safeName}`;
        cb(null, uniqueName);
    },
});

// Inicializar Multer
const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB máximo
    },
});

module.exports = upload;