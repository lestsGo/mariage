const db = require('C:\Users\DANIEL P\Desktop\t557\t2\mariage\backend\config\db');
const RSVP = db.sequelize.import('C:\Users\DANIEL P\Desktop\t557\t2\mariage\backend\models\rsvp');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Clé secrète pour JWT (à remplacer par une vraie clé sécurisée en production)
const JWT_SECRET = process.env.JWT_SECRET || 'wedding_secret_key';

// Données de l'administrateur (en dur pour la démo, utiliser une base en production)
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

exports.login = async (req, res) => {
  const { username, password } = req.body;
  
  try {
    // Vérification des identifiants
    if (username !== ADMIN_USERNAME || !bcrypt.compareSync(password, bcrypt.hashSync(ADMIN_PASSWORD))) {
      return res.status(401).json({ error: 'Identifiants invalides' });
    }
    
    // Création du token JWT
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
    
    res.json({ token });
  } catch (error) {
    console.error('Erreur lors de la connexion admin:', error);
    res.status(500).json({ error: 'Erreur d\'authentification' });
  }
};

exports.getRSVPs = async (req, res) => {
  try {
    // Récupérer tous les RSVP
    const rsvps = await RSVP.findAll({
      order: [['createdAt', 'DESC']]
    });
    
    res.json(rsvps);
  } catch (error) {
    console.error('Erreur lors de la récupération des RSVP:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.getStats = async (req, res) => {
  try {
    // Compter les présences
    const attending = await RSVP.count({ where: { attendance: 'yes' } });
    const notAttending = await RSVP.count({ where: { attendance: 'no' } });
    
    // Compter les accompagnants
    const totalGuests = await RSVP.sum('guests');
    
    res.json({
      attending,
      notAttending,
      totalGuests,
      totalResponses: attending + notAttending
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};