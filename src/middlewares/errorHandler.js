const errorHandler = (err, req, res, next) => {
    console.error(err.stack); // Log del error para depuración
    const statusCode = err.status || 500; // Código de estado HTTP
    res.status(statusCode).json({
      error: err.message || 'Error interno del servidor',
    });
  };
  
module.exports = errorHandler;