const mongoose = require('mongoose');

const participanteSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  points: {
    type: Number,
    required: true
  }
}, {
  timestamps: true // Agrega createdAt y updatedAt automáticamente
});

const Participante = mongoose.model('Participante', participanteSchema);

module.exports = Participante;
