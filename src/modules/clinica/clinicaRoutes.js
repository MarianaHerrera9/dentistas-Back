const express = require('express');
const authController = require('../../controllers/authController');
const ClinicaController = require('./clinicaController');
const checkPermiso = require('../../middlewares/checkPermiso');
const authMiddleware = require('../../middlewares/authMiddleware');
const router = express.Router();
const uploadLogo = require('../../middlewares/uploadLogo');

router.post('/register',authMiddleware, checkPermiso('permisos_clinica'), authController.registroClinica);
router.post('/auth/login', authController.login);

router.get(
    '/',
    authMiddleware,
    checkPermiso('gestionar_saas'),
    ClinicaController.getAll
);

router.get(
    '/:id',
    authMiddleware,
    ClinicaController.getById
);

router.put(
    '/:id',
    authMiddleware,
    checkPermiso('permisos_clinica'),
    ClinicaController.update
);

router.post("/:id/logo", uploadLogo.single("logo"), ClinicaController.uploadLogo);


module.exports = router;
