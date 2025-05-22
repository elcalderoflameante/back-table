const verificarRedLocal = (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress;

  //console.log('IP del cliente:', ip);

  // Verifica si la IP es local (127.0.0.1 o ::1)
  if (ip === '127.0.0.1' || 
      ip === '::1' || 
      ip.startsWith('::ffff:127.0.0.1') ||
      ip.startsWith('::ffff:192.168.1') // Cambia esto según tu red local  
    ) {
    return next(); // Permitir acceso
  }

  // Si no es local, rechazar la solicitud
  const error = new Error('Acceso denegado: solo permitido desde la red local');
  error.status = 403;
  next(error);
};

module.exports = verificarRedLocal;