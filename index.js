// Archivo: index.js

const http = require('http');
const app = require('./app'); // Importar la configuración de la aplicación desde app.js

// Iniciar servidor
const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
