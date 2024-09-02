// Archivo: index.js

const app = require('./app'); // Importar la configuración de la aplicación desde app.js
const http = require('http');
const cors = require('cors');
const express = require('express');
const app = express();

// Configurar middleware
app.use(express.json());
app.use(express.static('public')); // Sirve archivos estáticos de la carpeta 'public'

app.use(cors({
  origin: ['https://test-ia-gamma.vercel.app']
})
);


