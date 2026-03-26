const express = require('express');
const router = express.Router();
const verifyToken = require('../../middlewares/authMiddleware');
const { createLab, getLabsByClinic, updateLab, deleteLab } = require('./labController');

router.post('/', verifyToken, createLab);
router.get('/', verifyToken, getLabsByClinic);
router.put('/:id', verifyToken, updateLab);
router.delete('/:id', verifyToken, deleteLab);

module.exports = router;
