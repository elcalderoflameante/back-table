const express = require('express');
const cors = require('cors');
const solicitudesRoutes = require('./routes/solicitudes');
const authRoutes = require('./routes/auth');
const errorHandler = require('./middlewares/errorHandler');
const pushRoutes = require('./routes/push');

require('dotenv').config(); // Cargar variables de entorno desde .env

const app = express();

// Configurar CORS para aceptar solicitudes desde el frontend
const corsOptions = {
  origin: process.env.FRONTEND_URL, // Usar la URL del frontend desde .env
  methods: ['GET', 'POST', 'PATCH', 'DELETE'], // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization'], // Encabezados permitidos
};

app.use(cors(corsOptions)); // Aplicar configuración de CORS
app.use(express.json());

// Rutas
app.use('/api/solicitudes', solicitudesRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/push', pushRoutes);

// Middleware para manejar errores
app.use(errorHandler);

// Exporta la app de Express
module.exports = app;