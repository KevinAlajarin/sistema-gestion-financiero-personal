const { getPool } = require('../../config/database');
const fs = require('fs');
const path = require('path');

const seed = async () => {
    console.log('🌱 Iniciando Seed desde Node.js...');
    try {
        const pool = await getPool();
               
        // 1. Leer el archivo SQL de datos
        const seedDataSql = fs.readFileSync(path.join(__dirname, '../sql/03_seed_realistic_data.sql'), 'utf-8');
        
        // Ejecutar query
        await pool.request().query(seedDataSql);
        
        console.log('✅ Base de datos poblada correctamente.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error en Seed:', error);
        process.exit(1);
    }
};

seed();