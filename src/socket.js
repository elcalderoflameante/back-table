require('dotenv').config(); // Cargar variables de entorno desde .env

let io;

const initSocket = (server) => {
  io = require('socket.io')(server, {
    cors: {
      origin: process.env.FRONTEND_URL, // Usar la URL del frontend desde .env
      methods: ['GET', 'POST', 'PATCH', 'DELETE'], // Métodos permitidos
    },
  });

  console.log('🔌 Socket.IO inicializado');
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.IO no ha sido inicializado');
  }
  return io;
};

module.exports = { initSocket, getIO };