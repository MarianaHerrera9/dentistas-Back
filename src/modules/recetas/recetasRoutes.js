const express = require('express');
const router = express.Router();
const RecetasController = require('./recetasController');

// Rutas de Recetas
router.post('/', RecetasController.create);
router.get('/paciente/:id_paciente', RecetasController.getByPaciente);
router.get('/:id', RecetasController.getById);
router.delete('/:id', RecetasController.delete);

module.exports = router;
