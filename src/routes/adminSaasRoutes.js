// routes/adminSaasRoutes.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const AdminSaas = require('../models/adminSaasModel');

// POST /saas/admins
router.post('/admins', async (req, res) => {
    try {
        const { nombre, usuario, password, id_rol } = req.body;

        // Validar campos obligatorios
        if (!nombre || !usuario || !password || !id_rol) {
            return res.status(400).json({ mensaje: 'Faltan datos obligatorios' });
        }

        // Generar hash seguro
        const password_hash = await bcrypt.hash(password, 10);

        // Crear admin SaaS
        const id_admin = await AdminSaas.create({
            nombre,
            usuario,        // aquí guardamos el correo
            password_hash,
            id_rol
        });

        res.status(201).json({ mensaje: 'Admin SaaS creado', id_admin });

    } catch (err) {
        console.error(err);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
});

module.exports = router;
