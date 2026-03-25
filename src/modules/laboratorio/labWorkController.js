const LabWorkModel = require('./labWorkModel');

const createLabWork = async (req, res) => {
  try {
    const { id_clinica: clinicaId } = req.user;
    const { patientId, labId, workType, status, sendDate, expectedDate, cost, notas } = req.body;

    if (!patientId || !labId || !workType || !sendDate) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    const workId = await LabWorkModel.create({
      clinicId: clinicaId,
      patientId,
      labId,
      workType,
      status,
      sendDate,
      expectedDate,
      cost,
      notas
    });

    res.status(201).json({ 
      success: true, 
      message: 'Trabajo de laboratorio creado', 
      workId 
    });
  } catch (error) {
    console.error('Error al crear trabajo:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

const getLabWorksByClinic = async (req, res) => {
  try {
    const { id_clinica: clinicaId } = req.user;
    const works = await LabWorkModel.findAllByClinic(clinicaId);
    res.status(200).json(works);
  } catch (error) {
    console.error('Error al obtener trabajos:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

const updateLabWork = async (req, res) => {
  try {
    const { id_clinica: clinicaId } = req.user;
    const { id } = req.params;
    const { patientId, labId, workType, status, sendDate, expectedDate, cost, notas } = req.body;

    const updated = await LabWorkModel.update(Number(id), clinicaId, {
      patientId,
      labId,
      workType,
      status,
      sendDate,
      expectedDate,
      cost,
      notas
    });

    if (!updated) {
      return res.status(404).json({ error: 'Trabajo no encontrado' });
    }

    res.status(200).json({ success: true, message: 'Trabajo actualizado' });
  } catch (error) {
    console.error('Error al actualizar trabajo:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

const updateLabWorkStatus = async (req, res) => {
    try {
      const { id_clinica: clinicaId } = req.user;
      const { id } = req.params;
      const { status } = req.body;
  
      if (!status) {
          return res.status(400).json({ error: 'El estado es requerido' });
      }

      const updated = await LabWorkModel.updateStatus(Number(id), clinicaId, status);
  
      if (!updated) {
        return res.status(404).json({ error: 'Trabajo no encontrado' });
      }
  
      res.status(200).json({ success: true, message: 'Estado actualizado' });
    } catch (error) {
      console.error('Error al cambiar estado de trabajo:', error);
      res.status(500).json({ error: 'Error del servidor' });
    }
  };

const deleteLabWork = async (req, res) => {
  try {
    const { id_clinica: clinicaId } = req.user;
    const { id } = req.params;

    const deleted = await LabWorkModel.delete(Number(id), clinicaId);
    if (!deleted) {
      return res.status(404).json({ error: 'Trabajo no encontrado' });
    }

    res.status(200).json({ success: true, message: 'Trabajo eliminado' });
  } catch (error) {
    console.error('Error al eliminar trabajo:', error);
    res.status(500).json({ error: 'Error del servidor al eliminar' });
  }
};

module.exports = {
    createLabWork,
    getLabWorksByClinic,
    updateLabWork,
    updateLabWorkStatus,
    deleteLabWork
};
