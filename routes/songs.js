const express = require('express');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const Song = require('../models/song');
const router = express.Router();

// Cloudinary Yapılandırması
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// Multer için Cloudinary Depolama Yapılandırması
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'musicApp',
    resource_type: 'auto',
  },
});

const upload = multer({ storage: storage });

// Şarkı Yükleme Rotası
router.post('/add', upload.single('file'), async (req, res) => {
  const { title, artist, album } = req.body;
  const song = new Song({
    title,
    filePath: req.file.path, // Cloudinary'den gelen dosya URL'si
  });
  await song.save();
  res.redirect('/');
});

module.exports = router;
