const express = require('express');
const router = express.Router();
const adminController = require('C:\Users\DANIEL P\Desktop\t557\t2\mariage\backend\controllers\admincontroller');
const authMiddleware = require('C:\Users\DANIEL P\Desktop\t557\t2\mariage\backend\middleware\auth');

// Connexion administrateur
router.post('/login', adminController.login);

// Routes protégées par authentification
router.use(authMiddleware.verifyToken);

// Récupérer toutes les réponses RSVP
router.get('/rsvps', adminController.getRSVPs);

// Récupérer les statistiques
router.get('/stats', adminController.getStats);

module.exports = router;