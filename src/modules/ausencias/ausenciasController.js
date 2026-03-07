const AusenciasModel = require('./ausenciasModel');

/**
 * Middleware de autorización: permite acceso si el usuario es el propio doctor
 * (id_dentista del JWT coincide) O si tiene permiso 'administrar_clinica'.
 *
 * Requiere que el param :id_dentista exista en la ruta, O que body.id_dentista
 * sea comparado contra el JWT (usado en POST).
 */
const checkOwnerOrAdmin = (getId) => (req, res, next) => {
    const user = req.user;
    const id_dentista = getId(req);

    const esAdmin = user?.permisos?.includes('administrar_clinica');
    const esPropietario = user?.id_dentista && Number(user.id_dentista) === Number(id_dentista);

    if (esAdmin || esPropietario) return next();

    return res.status(403).json({
        error: 'Solo el propio doctor o un administrador puede realizar esta acción',
    });
};

const AusenciasController = {

    /**
     * POST /ausencias
     * Body: { id_clinica, id_dentista, tipo, fecha_inicio, fecha_fin, hora_inicio?, hora_fin?, motivo? }
     */
    create: async (req, res) => {
        try {
            const {
                id_clinica,
                id_dentista,
                tipo,
                fecha_inicio,
                fecha_fin,
                hora_inicio,
                hora_fin,
                motivo,
            } = req.body;

            // Validaciones básicas
            if (!id_clinica || !id_dentista || !tipo || !fecha_inicio || !fecha_fin) {
                return res.status(400).json({
                    error: 'Se requieren: id_clinica, id_dentista, tipo, fecha_inicio, fecha_fin',
                });
            }

            if (!['vacaciones', 'no_disponibilidad'].includes(tipo)) {
                return res.status(400).json({
                    error: "tipo debe ser 'vacaciones' o 'no_disponibilidad'",
                });
            }

            if (fecha_inicio > fecha_fin) {
                return res.status(400).json({ error: 'fecha_inicio no puede ser mayor que fecha_fin' });
            }

            if (tipo === 'no_disponibilidad') {
                if (!hora_inicio || !hora_fin) {
                    return res.status(400).json({
                        error: "Las no_disponibilidades requieren hora_inicio y hora_fin",
                    });
                }
                if (hora_inicio >= hora_fin) {
                    return res.status(400).json({ error: 'hora_inicio debe ser menor que hora_fin' });
                }
            }

            const id_ausencia = await AusenciasModel.create({
                id_clinica,
                id_dentista,
                tipo,
                fecha_inicio,
                fecha_fin,
                hora_inicio: tipo === 'no_disponibilidad' ? hora_inicio : null,
                hora_fin: tipo === 'no_disponibilidad' ? hora_fin : null,
                motivo: motivo || null,
                creado_por: req.user?.id_usuario || null,
            });

            const ausencia = await AusenciasModel.getById(id_ausencia);
            res.status(201).json({ message: 'Ausencia registrada correctamente', ausencia });
        } catch (err) {
            console.error('[AusenciasController.create]', err);
            res.status(500).json({ error: 'Error al registrar la ausencia' });
        }
    },

    /**
     * GET /ausencias/clinica/:id_clinica?fecha_inicio=YYYY-MM-DD&fecha_fin=YYYY-MM-DD
     */
    getByClinica: async (req, res) => {
        try {
            const { id_clinica } = req.params;
            const { fecha_inicio, fecha_fin } = req.query;

            const ausencias = await AusenciasModel.getByClinica(
                Number(id_clinica),
                fecha_inicio || null,
                fecha_fin || null
            );

            res.json(ausencias);
        } catch (err) {
            console.error('[AusenciasController.getByClinica]', err);
            res.status(500).json({ error: 'Error al obtener ausencias de la clínica' });
        }
    },

    /**
     * GET /ausencias/dentista/:id_dentista
     */
    getByDentista: async (req, res) => {
        try {
            const { id_dentista } = req.params;
            const ausencias = await AusenciasModel.getByDentista(Number(id_dentista));
            res.json(ausencias);
        } catch (err) {
            console.error('[AusenciasController.getByDentista]', err);
            res.status(500).json({ error: 'Error al obtener ausencias del doctor' });
        }
    },

    /**
     * PUT /ausencias/:id_ausencia
     */
    update: async (req, res) => {
        try {
            const { id_ausencia } = req.params;
            const ausenciaActual = await AusenciasModel.getById(Number(id_ausencia));

            if (!ausenciaActual) {
                return res.status(404).json({ error: 'Ausencia no encontrada' });
            }

            const { fecha_inicio, fecha_fin, hora_inicio, hora_fin, motivo, tipo } = req.body;

            // Si cambia a no_disponibilidad, requiere horas
            const tipoFinal = tipo || ausenciaActual.tipo;
            if (tipoFinal === 'no_disponibilidad') {
                const hI = hora_inicio ?? ausenciaActual.horaInicio;
                const hF = hora_fin ?? ausenciaActual.horaFin;
                if (!hI || !hF) {
                    return res.status(400).json({
                        error: 'Las no_disponibilidades requieren hora_inicio y hora_fin',
                    });
                }
            }

            const ausenciaActualizada = await AusenciasModel.update(Number(id_ausencia), {
                tipo,
                fecha_inicio,
                fecha_fin,
                hora_inicio: tipoFinal === 'vacaciones' ? null : hora_inicio,
                hora_fin: tipoFinal === 'vacaciones' ? null : hora_fin,
                motivo,
            });

            res.json({ message: 'Ausencia actualizada correctamente', ausencia: ausenciaActualizada });
        } catch (err) {
            console.error('[AusenciasController.update]', err);
            res.status(500).json({ error: 'Error al actualizar la ausencia' });
        }
    },

    /**
     * DELETE /ausencias/:id_ausencia
     */
    delete: async (req, res) => {
        try {
            const { id_ausencia } = req.params;
            const ausencia = await AusenciasModel.getById(Number(id_ausencia));

            if (!ausencia) {
                return res.status(404).json({ error: 'Ausencia no encontrada' });
            }

            await AusenciasModel.delete(Number(id_ausencia));
            res.json({ message: 'Ausencia eliminada correctamente' });
        } catch (err) {
            console.error('[AusenciasController.delete]', err);
            res.status(500).json({ error: 'Error al eliminar la ausencia' });
        }
    },

    // Exportar el middleware para usarlo en las rutas
    checkOwnerOrAdmin,
};

module.exports = AusenciasController;
