// Archivo: app.js

const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const { MongoClient } = require('mongodb');
const uri = 'mongodb+srv://devprueba2022:newdev2024@cluster0.9x8yltr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'; // Reemplaza con tu cadena de conexión de MongoDB
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



// Configurar middleware
app.use(express.json());
app.use(express.static('public')); // Sirve archivos estáticos de la carpeta 'public'

// Configurar CORS para permitir solicitudes desde el origen específico
app.use(cors({
  origin: ['https://test-ia-gamma.vercel.app']
}));

// Ruta simple para verificar si el servidor está en marcha
app.get('/status', (req, res) => {
  res.send('Servidor en marcha');
});



app.post('/saveLead', async (req, res) => {
  const { name, email, phone } = req.body;

  try {
    await client.connect();
    const database = client.db('testdb'); // Reemplaza con tu nombre de base de datos
    const collection = database.collection('leads'); // Reemplaza con tu colección

    await collection.insertOne({ name, email, phone });

    res.json({ success: true });
  } catch (error) {
    console.error('Error guardando datos:', error);
    res.status(500).json({ success: false, message: 'Hubo un problema al guardar los datos' });
  } finally {
    await client.close();
  }
});

  
// Ruta para obtener los mejores puntajes
app.get('/getTopScores', (req, res) => {
  const userDataFilePath = path.join(__dirname, 'userData.json'); // Ruta al archivo con los puntajes de usuario

  // Leer los datos del archivo userData.json
  fs.readFile(userDataFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error leyendo datos:', err);
      return res.status(500).send('Error leyendo datos');
    }

    let userData = [];

    try {
      userData = JSON.parse(data);
    } catch (parseError) {
      console.error('Error parseando datos:', parseError);
      return res.status(500).send('Error parseando datos');
    }

    // Ordenar los datos por puntaje descendente (asumiendo que hay un campo 'score')
    userData.sort((a, b) => b.score - a.score);

    // Seleccionar los tres primeros resultados
    const topScores = userData.slice(0, 3);

    res.json(topScores);
  });
});

// Ruta para guardar los datos de usuario
app.post('/saveUserData', (req, res) => {
  const userData = req.body;
  const userDataFilePath = path.join(__dirname, 'userData.json'); // Ruta al archivo con los puntajes de usuario

  fs.readFile(userDataFilePath, 'utf8', (err, data) => {
    if (err) return res.status(500).send('Error leyendo datos de usuario');

    let users = [];
    if (data) {
      users = JSON.parse(data);
    }

    users.push(userData);
    users.sort((a, b) => b.points - a.points);
    fs.writeFile(userDataFilePath, JSON.stringify(users, null, 2), 'utf8', (err) => {
      if (err) return res.status(500).send('Error guardando datos de usuario');
      res.json({ message: 'Datos guardados' });
    });
  });
});

module.exports = app;
