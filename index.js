// Archivo: index.js

const app = require('./app'); // Importar la configuración de la aplicación desde app.js
const http = require('http');

// Configuración del puerto
const PORT = process.env.PORT || 3000;

// Crear el servidor HTTP y usar la app configurada
