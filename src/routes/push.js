const express = require('express');
const router = express.Router();
const webpush = require('../utils/webpush');
const Suscripcion = require('../models/Suscripcion');

// Endpoint para registrar la suscripción del cliente
router.post('/subscribe', async (req, res) => {
  const subscription = req.body;
  console.log('Nueva suscripción recibida:', subscription);
  try {
    await Suscripcion.findOrCreate({
      where: { endpoint: subscription.endpoint },
      defaults: { keys: subscription.keys }
    });
    res.status(201).json({ message: 'Suscripción guardada' });
  } catch (err) {
    res.status(500).json({ message: 'Error al guardar la suscripción' });
  }
});

// Endpoint para enviar notificación a todos los suscritos
router.post('/notify', async (req, res) => {
  const { title, body } = req.body;
  const payload = JSON.stringify({ title, body });

  try {
    const suscripciones = await Suscripcion.findAll();
    const sendPromises = suscripciones.map(sub =>
      webpush.sendNotification(
        {
          endpoint: sub.endpoint,
          keys: sub.keys
        },
        payload
      ).catch(err => null)
    );
    await Promise.all(sendPromises);

    res.json({ message: 'Notificaciones enviadas' });
  } catch (err) {
    res.status(500).json({ message: 'Error al enviar notificaciones' });
  }
});

module.exports = router;