const http = require('http');
const { initSocket, getIO } = require('./socket');
const socketHandlers = require('./handlers/socketHandlers'); // Importar manejadores de eventos
const app = require('./app');
const sequelize = require('./config/db');
const Solicitud = require('./models/Solicitud');

const PORT = process.env.PORT || 3001;
const server = http.createServer(app);

// Inicializa Socket.IO
initSocket(server);

// Maneja eventos de Socket.IO
const io = getIO();
socketHandlers(io); // Delegar manejo de eventos a socketHandlers.js

// Iniciar servidor y conectar a PostgreSQL
sequelize.authenticate()
  .then(() => {
    console.log('✅ PostgreSQL conectado');
    return Solicitud.sync({ alter: true }); // Cambiar esto en producción por migraciones
  })
  .then(() => {
    console.log('🔄 Modelo "Solicitud" sincronizado');
    server.listen(PORT, () => {
      console.log(`🚀 Servidor en http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Error:', err);
  });