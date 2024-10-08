// Archivo: app.js

const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const Participante = require('./SchemasParticipantes.js');
const mongoose = require('mongoose');



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

app.post('/saveUserData', async (req, res) => {
  const userData = req.body;

  try {
      // Conectar a MongoDB
      await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

      // Crear un nuevo participante con los datos del usuario
      const participante = new Participante({
          name: userData.name,
          points: userData.points
      });

      console.log("Datos recibidos del frontend:", userData); // Log para verificar los datos recibidos
      console.log("Participante creado:", participante); // Verifica que el objeto participante se crea correctamente

      // Guardar el participante en la base de datos
      await participante.save();

      res.json({ message: 'Datos guardados correctamente' });
  } catch (error) {
      console.error('Error guardando datos de usuario:', error);
      res.status(500).json({ success: false, message: 'Error guardando datos de usuario' });
  } finally {
      await mongoose.disconnect();
  }
});



  app.post('/saveTopScores', async (req, res) => {
    const { scores } = req.body;

    try {
        // Asegúrate de que 'scores' es un array de objetos con los campos correctos
        if (!Array.isArray(scores)) {
            return res.status(400).json({ success: false, message: 'Formato de datos incorrecto' });
        }

        // Guardar cada puntaje en la base de datos
        await Participante.deleteMany(); // Opcional: Limpiar la colección antes de guardar nuevos datos
        await Participante.insertMany(scores);

        res.json({ success: true, message: 'Puntajes guardados correctamente' });
    } catch (error) {
        console.error('Error guardando los puntajes:', error);
        res.status(500).json({ success: false, message: 'Error guardando los puntajes' });
    }
});
  
  

module.exports = app;
