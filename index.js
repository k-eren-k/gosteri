require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
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

// MongoDB Modeli - Song
const songSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  artist: {
    type: String,
    required: true
  },
  genre: {
    type: String,
    required: true
  }
});

const Song = mongoose.model('Song', songSchema);

// Anasayfa - Tüm şarkıları listele
app.get('/', async (req, res) => {
  try {
    const songs = await Song.find({});
    res.render('index', { songs });
  } catch (err) {
    console.error(err);
    res.status(500).send('Veritabanından şarkılar alınırken hata oluştu.');
  }
});

// Şarkı ekleme sayfası
app.get('/ses', (req, res) => {
  res.render('add');
});

// Şarkı ekleme işlemi
app.post('/songs/add', async (req, res) => {
  const { title, artist, genre } = req.body;

  const newSong = new Song({
    title,
    artist,
    genre
  });

  try {
    await newSong.save();
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Şarkı eklenirken bir hata oluştu.');
  }
});

// Sunucu başlatma
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor`);
});
