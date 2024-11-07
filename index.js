require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const songRoutes = require('./routes/songs'); // Şarkı rotaları
const ejs = require('ejs');

const app = express();

// MongoDB bağlantısı
mongoose.connect('mongodb+srv://mongo:mongo@cluster0.6us6keo.mongodb.net/music-app?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB bağlantısı başarılı'))
  .catch(err => console.error('MongoDB bağlantı hatası:', err));

// EJS ayarları
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Statik dosyalar (CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// URL kod çözme ve JSON isteği işleme
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Şarkılarla ilgili rotalar
app.use('/songs', songRoutes);

// Ana sayfa - Tüm şarkıları listele
app.get('/', async (req, res) => {
  const Song = require('./models/song');
  const songs = await Song.find({});
  res.render('index', { songs });
});

// Şarkı ekleme sayfası
app.get('/ses', async (req, res) => {
  res.render('add');
});

// Sunucu başlatma
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor`);
});
