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
});

// Adiciona o método para gerar o token
userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, 'secrettoken', { expiresIn: '1h' }); // "secrettoken" deve ser um segredo forte e único
  return token;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
