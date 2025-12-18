const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas API
app.use('/api', routes);

app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date() });
});

// Manejo de Errores 
app.use(errorHandler);

module.exports = app;