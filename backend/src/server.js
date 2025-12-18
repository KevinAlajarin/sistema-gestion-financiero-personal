const app = require('./app');
const { getPool } = require('./config/database');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        // Verificar conexión a DB antes de levantar
        await getPool();
        
        app.listen(PORT, () => {
            console.log(`🚀 Servidor Financiero corriendo en http://localhost:${PORT}`);
            console.log(`📝 Entorno: ${process.env.NODE_ENV}`);
        });
    } catch (error) {
        console.error('❌ Fallo crítico al iniciar el servidor:', error);
        process.exit(1);
    }
};

startServer();