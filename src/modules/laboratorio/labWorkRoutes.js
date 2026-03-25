const express = require('express');
const router = express.Router();
const verifyToken = require('../../middlewares/authMiddleware');
const { createLabWork, getLabWorksByClinic, updateLabWork, updateLabWorkStatus, deleteLabWork } = require('./labWorkController');

router.post('/', verifyToken, createLabWork);
router.get('/', verifyToken, getLabWorksByClinic);
router.put('/:id', verifyToken, updateLabWork);
router.patch('/:id/status', verifyToken, updateLabWorkStatus);
router.delete('/:id', verifyToken, deleteLabWork);

module.exports = router;
