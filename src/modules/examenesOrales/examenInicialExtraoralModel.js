const db = require('../../db/index');
const { examenClinicoInicialExtraoral } = require('../../db/schema');

const ExamenInicialExtraoral = {

    async create(data) {
        const [result] = await db.insert(examenClinicoInicialExtraoral).values({
            idPaciente: data.id_paciente,
            cabeza: data.cabeza || null,
            cara: data.cara || null,
            atm: data.atm || null,
            ganglios: data.ganglios || null,
            labios: data.labios || null,
            senalesParticulares: data.senales_particulares || null
        });

        return result.insertId;
    }

};

module.exports = ExamenInicialExtraoral;
