const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  isbn: { type: String, required: true, unique: true },
  quantity: { type: Number, required: true, default: 1 },
  available: { type: Number, default: function () { return this.quantity; } },
});

module.exports = mongoose.model('Book', bookSchema);