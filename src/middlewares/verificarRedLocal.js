const verificarRedLocal = (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress;
  const prefix = process.env.REDE_LOCAL_PREFIX || '192.168.1.';

  // Permitir localhost
  if (
    ip === '127.0.0.1' ||
    ip === '::1' ||
    ip.startsWith('::ffff:127.0.0.1')
  ) {
    return next();
  }

  // Permitir solo si la IP comienza con el prefijo de red local
  if (
    ip.startsWith(prefix) ||
    ip.startsWith('::ffff:' + prefix)
  ) {
    return next();
  }

  // Si no es local, rechazar la solicitud
  const error = new Error('Acceso denegado: solo permitido desde la red local');
  error.status = 403;
  next(error);
};

module.exports = verificarRedLocal;