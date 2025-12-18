const sql = require('mssql');
require('dotenv').config();

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    port: parseInt(process.env.DB_PORT, 10) || 1433,
    options: {
        encrypt: process.env.DB_ENCRYPT === 'true',
        trustServerCertificate: true, // Útil para dev local
        enableArithAbort: true
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
};

// Singleton del Pool
let poolPromise;

const getPool = async () => {
    if (!poolPromise) {
        poolPromise = new sql.ConnectionPool(config)
            .connect()
            .then(pool => {
                console.log('✅ Conectado a SQL Server');
                return pool;
            })
            .catch(err => {
                console.error('❌ Error conectando a base de datos:', err);
                poolPromise = null; // Resetear promesa en error para reintentar
                throw err;
            });
    }
    return poolPromise;
};

module.exports = {
    getPool,
    sql // Exportamos el objeto sql para acceder a tipos (sql.Int, sql.VarChar, etc)
};