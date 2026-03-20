const mysql = require('mysql2/promise');
require('dotenv').config({ path: 'c:/Users/yessi/Downloads/ESTADIA/asistDental-B/.env' });

async function fix() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT || "3306"),
  });

  try {
    console.log('Adding id_clinica to catalogo_diagnosticos...');
    await connection.query('ALTER TABLE `catalogo_diagnosticos` ADD COLUMN `id_clinica` int DEFAULT NULL');
    console.log('Adding foreign key...');
    await connection.query('ALTER TABLE `catalogo_diagnosticos` ADD CONSTRAINT `fk_diagnosticos_clinica` FOREIGN KEY (`id_clinica`) REFERENCES `clinicas`(`id_clinica`) ON DELETE CASCADE');
    console.log('Adding index...');
    await connection.query('CREATE INDEX `idx_diagnosticos_clinica` ON `catalogo_diagnosticos` (`id_clinica`)');
    console.log('Database fix complete!');
  } catch (err) {
    if (err.code === 'ER_DUP_FIELDNAME') {
      console.log('Column id_clinica already exists.');
    } else {
      console.error('Error during update:', err);
    }
  } finally {
    await connection.end();
  }
}

fix();
