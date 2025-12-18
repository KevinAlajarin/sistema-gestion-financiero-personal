const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middlewares Globales
app.use(cors()); // Permitir frontend local
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas API
app.use('/api', routes);

// Health Check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date() });
});

// Manejo de Errores (Debe ser el último middleware)
app.use(errorHandler);

module.exports = app;