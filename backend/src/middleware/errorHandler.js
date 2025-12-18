// Middleware centralizado de manejo de errores
const errorHandler = (err, req, res, next) => {
    console.error(`[Error] ${err.message}`);
    if (process.env.NODE_ENV === 'development') {
        console.error(err.stack);
    }

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Error Interno del Servidor';

    res.status(statusCode).json({
        error: true,
        message: message
    });
};

module.exports = errorHandler;