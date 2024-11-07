const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  title: { type: String, required: true },
  filePath: { type: String, required: true }, // Cloudinary URL'sini saklar
});

module.exports = mongoose.model('Song', songSchema);
