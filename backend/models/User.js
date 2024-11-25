const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  // Adiciona o campo 'reviews' para armazenar os IDs das avaliações
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review',  // Referência ao modelo de Review
  }],
});

// Adiciona o método para gerar o token
userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, 'secrettoken', { expiresIn: '1h' });
  return token;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
