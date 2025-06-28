const express = require('express');
const router = express.Router();
const rsvpController = require('C:\Users\DANIEL P\Desktop\t557\t2\mariage\backend\controllers\rsvpcontroller');

// Soumettre une réponse RSVP
router.post('/', rsvpController.submitRSVP);

module.exports = router;