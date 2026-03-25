const LabModel = require('./labModel');

const createLab = async (req, res) => {
  try {
    const { id_clinica: clinicaId } = req.user;
    const { nombre, telefono, direccion } = req.body;

    if (!nombre) {
      return res.status(400).json({ error: 'El nombre del laboratorio es requerido' });
    }

    const labId = await LabModel.create({
      clinicId: clinicaId,
      nombre,
      telefono,
      direccion
    });

    res.status(201).json({ 
      success: true, 
      message: 'Laboratorio creado exitosamente', 
      labId 
    });
  } catch (error) {
    console.error('Error al crear laboratorio:', error);
    res.status(500).json({ error: 'Error del servidor al crear laboratorio' });
  }
};

const getLabsByClinic = async (req, res) => {
  try {
    const { id_clinica: clinicaId } = req.user;
    const labs = await LabModel.findAllByClinic(clinicaId);
    res.status(200).json(labs);
  } catch (error) {
    console.error('Error al obtener laboratorios:', error);
    res.status(500).json({ error: 'Error del servidor al obtener laboratorios' });
  }
};

const updateLab = async (req, res) => {
  try {
    const { id_clinica: clinicaId } = req.user;
    const { id } = req.params;
    const { nombre, telefono, direccion } = req.body;

    const updated = await LabModel.update(Number(id), clinicaId, {
      nombre,
      telefono,
      direccion
    });

    if (!updated) {
      return res.status(404).json({ error: 'Laboratorio no encontrado o sin cambios' });
    }

    res.status(200).json({ success: true, message: 'Laboratorio actualizado' });
  } catch (error) {
    console.error('Error al actualizar laboratorio:', error);
    res.status(500).json({ error: 'Error del servidor al actualizar laboratorio' });
  }
};

const deleteLab = async (req, res) => {
  try {
    const { id_clinica: clinicaId } = req.user;
    const { id } = req.params;

    const deleted = await LabModel.delete(Number(id), clinicaId);
    if (!deleted) {
      return res.status(404).json({ error: 'Laboratorio no encontrado' });
    }

    res.status(200).json({ success: true, message: 'Laboratorio eliminado' });
  } catch (error) {
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
        return res.status(400).json({ error: 'No se puede eliminar el laboratorio porque tiene trabajos asociados' });
    }
    console.error('Error al eliminar laboratorio:', error);
    res.status(500).json({ error: 'Error del servidor al eliminar laboratorio' });
  }
};

module.exports = {
  createLab,
  getLabsByClinic,
  updateLab,
  deleteLab
};
