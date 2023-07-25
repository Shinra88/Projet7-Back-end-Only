const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const booksRoutes = require('./routes/books');
const userRoutes = require('./routes/user');
const path = require('path');
const cors = require('cors');
mongoose.connect('mongodb+srv://shinra88:Chokobo88@cluster0.r7gacpk.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true 
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(bodyParser.json());
app.use(express.json());

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/books', booksRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;