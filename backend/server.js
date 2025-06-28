require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./config/db');
const rsvpRoutes = require('./routes/rsvp');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 5000;

// Configuration middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/rsvp', rsvpRoutes);
app.use('/api/admin', adminRoutes);

// Synchronisation de la base de données
db.sequelize.sync().then(() => {
  console.log('Base de données synchronisée');
  app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
  });
});