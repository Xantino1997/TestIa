// Archivo: index.js

const app = require('./app'); // Importar la configuración de la aplicación desde app.js
const http = require('http');
const cors = require('cors');
app.use(cors({
  origin: ['https://test-ia-gamma.vercel.app']
})
);


