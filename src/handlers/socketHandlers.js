module.exports = (io) => {
    io.on('connection', (socket) => {
      console.log('⚡ Cliente conectado:', socket.id);
  
      // Evento de desconexión
      socket.on('disconnect', () => {
        console.log('🔌 Cliente desconectado:', socket.id);
      });
  
      // Agrega más eventos personalizados aquí
      socket.on('evento_personalizado', (data) => {
        console.log('📩 Evento personalizado recibido:', data);
        // Puedes emitir respuestas o manejar lógica aquí
      });
    });
};