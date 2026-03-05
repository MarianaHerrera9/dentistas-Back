const db = require('../../db/index');
const { examenClinicoInicialIntraoral } = require('../../db/schema');

const ExamenInicialIntraoral = {

    async create(data) {
        const [result] = await db.insert(examenClinicoInicialIntraoral).values({
            idPaciente: data.id_paciente,
            encia: data.encia || null,
            orofaringe: data.orofaringe || null,
            lengua: data.lengua || null,
            pisoBoca: data.piso_boca || null,
            paladarDuro: data.paladar_duro || null,
            tipoOclusion: data.tipo_oclusion || null,
            paladarBlando: data.paladar_blando || null,
            rebordeResidual: data.reborde_residual || null
        });

        return result.insertId;
    }

};

module.exports = ExamenInicialIntraoral;
