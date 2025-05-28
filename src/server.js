const http = require('http');
const { initSocket, getIO } = require('./socket');
const socketHandlers = require('./handlers/socketHandlers');
const app = require('./app');
const sequelize = require('./config/db');
const Solicitud = require('./models/Solicitud');
const Usuario = require('./models/Usuario'); // Asegúrate de importar el modelo

const PORT = process.env.PORT || 3001;
const server = http.createServer(app);

// Inicializa Socket.IO
initSocket(server);

// Maneja eventos de Socket.IO
const io = getIO();
socketHandlers(io);

// Iniciar servidor y conectar a PostgreSQL
sequelize.authenticate()
  .then(() => {
    console.log('✅ PostgreSQL conectado');
    // Sincroniza todos los modelos definidos
    return sequelize.sync({ alter: true }); // Cambia a { force: true } solo si quieres borrar y recrear tablas
  })
  .then(() => {
    console.log('🔄 Modelos sincronizados');
    server.listen(PORT, () => {
      console.log(`🚀 Servidor en http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Error:', err);
  });