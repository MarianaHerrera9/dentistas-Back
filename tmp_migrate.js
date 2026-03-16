const db = require('./src/config/db');

async function migrate() {
    try {
        console.log('Iniciando migración: Agregando nota_cierre a periodontogramas...');
        await db.query('ALTER TABLE periodontogramas ADD COLUMN IF NOT EXISTS nota_cierre TEXT AFTER notas;');
        console.log('Migración completada con éxito.');
    } catch (err) {
        console.error('Error durante la migración:', err);
        // Intentar sin IF NOT EXISTS por si es una versión antigua de MariaDB/MySQL
        try {
            console.log('Reintentando sin IF NOT EXISTS...');
            await db.query('ALTER TABLE periodontogramas ADD COLUMN nota_cierre TEXT AFTER notas;');
            console.log('Migración completada con éxito (reintento).');
        } catch (err2) {
             if (err2.code === 'ER_DUP_FIELDNAME') {
                 console.log('La columna nota_cierre ya existe.');
             } else {
                 console.error('Error crítico en reintento:', err2);
             }
        }
    } finally {
        process.exit();
    }
}

migrate();
