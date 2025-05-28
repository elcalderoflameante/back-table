const express = require('express');
const router = express.Router();
const Solicitud = require('../models/Solicitud');
const Suscripcion = require('../models/Suscripcion');
const { getIO } = require('../socket');
const verificarRedLocal = require('../middlewares/verificarRedLocal');
const authMiddleware = require('../middlewares/authMiddleware');
const { Op } = require('sequelize');
const webpush = require('../utils/webpush');

// Obtener solicitudes activas (nuevas + en proceso)
router.get('/activas', authMiddleware,async (req, res, next) => {
  try {
    // Obtener el inicio y fin del día actual
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    
    const solicitudes = await Solicitud.findAll({
      where: {
        fecha_creacion: {
          [Op.between]: [startOfDay, endOfDay],
        },
      },
      order: [['fecha_creacion', 'DESC']],
    });
    res.json(solicitudes);
  } catch (err) {
    next(err); // Pasar el error al middleware
  }
});

// Iniciar atención (nuevo -> proceso)
router.patch('/:id/procesar', authMiddleware, async (req, res, next) => {
  try {
    const solicitud = await Solicitud.findByPk(req.params.id);
    if (!solicitud) {
      const error = new Error('Solicitud no encontrada');
      error.status = 404;
      throw error;
    }

    if (solicitud.estado !== 'nuevo') {
      const error = new Error('Solo solicitudes nuevas pueden procesarse');
      error.status = 400;
      throw error;
    }

    const actualizada = await solicitud.update({
      estado: 'proceso',
      fecha_respuesta: new Date(),
    });

    getIO().emit('solicitud_actualizada', actualizada);
    res.json(actualizada);
  } catch (err) {
    next(err); // Pasar el error al middleware
  }
});

// Finalizar atención (proceso -> atendido)
router.patch('/:id/finalizar', authMiddleware, async (req, res, next) => {
  try {
    const solicitud = await Solicitud.findByPk(req.params.id);
    if (!solicitud) {
      const error = new Error('Solicitud no encontrada');
      error.status = 404;
      throw error;
    }

    if (solicitud.estado !== 'proceso') {
      const error = new Error('Solo solicitudes en proceso pueden finalizarse');
      error.status = 400;
      throw error;
    }

    const actualizada = await solicitud.update({
      estado: 'atendido',
      fecha_cierre: new Date(),
    });

    getIO().emit('solicitud_actualizada', actualizada);
    res.json(actualizada);
  } catch (err) {
    next(err); // Pasar el error al middleware
  }
});

// Crear nueva solicitud (desde el QR)
router.post('/', verificarRedLocal, async (req, res, next) => {
  try {
    const { mesa, tipo } = req.body;
    if (!mesa || !tipo) {
      const error = new Error('Mesa y tipo son requeridos');
      error.status = 400;
      throw error;
    }

    const solicitud = await Solicitud.create({
      mesa,
      tipo,
      estado: 'nuevo',
      fecha_creacion: new Date(),
    });

    // Notificación push a todos los suscritos
    const suscripciones = await Suscripcion.findAll();
    const payload = JSON.stringify({
      title: 'Nueva Solicitud',
      body: `Mesa ${mesa} ha realizado una nueva solicitud de tipo "${tipo}".`
    });
    suscripciones.forEach(sub => {
      webpush.sendNotification(
        {
          endpoint: sub.endpoint,
          keys: sub.keys
        },
        payload
      ).catch(() => {});
    });

    getIO().emit('nueva_solicitud', solicitud);
    res.status(201).json(solicitud);
  } catch (err) {
    next(err); // Pasar el error al middleware
  }
});

// Nueva ruta para verificar estado por mesa
router.get('/mesa/:mesaId', async (req, res, next) => {
  try {
    const mesaId = req.params.mesaId;
    if (!mesaId) {
      const error = new Error('Número de mesa inválido');
      error.status = 400;
      throw error;
    }

    const solicitud = await Solicitud.findOne({
      where: {
        mesa: mesaId,
        estado: ['nuevo', 'proceso'], // Solo solicitudes no atendidas
      },
      order: [['fecha_creacion', 'DESC']],
    });

    res.json(solicitud);
  } catch (err) {
    next(err); // Pasar el error al middleware
  }
});

module.exports = router;