const db = require('C:\Users\DANIEL P\Desktop\t557\t2\mariage\backend\config\db');
const RSVP = db.sequelize.import('C:\Users\DANIEL P\Desktop\t557\t2\mariage\backend\models\rsvp');
const emailService = require('C:\Users\DANIEL P\Desktop\t557\t2\mariage\backen\/services\emailservice');

exports.submitRSVP = async (req, res) => {
  try {
    const { firstName, lastName, email, attendance, guests, dietary, message } = req.body;
    
    // Validation des données
    if (!firstName || !lastName || !email || !attendance) {
      return res.status(400).json({ error: 'Les champs obligatoires sont manquants' });
    }
    
    // Création de la réponse RSVP
    const newRSVP = await RSVP.create({
      firstName,
      lastName,
      email,
      attendance,
      guests: attendance === 'yes' ? guests : 0,
      dietary: attendance === 'yes' ? dietary : null,
      message
    });
    
    // Envoi de notification par email
    await emailService.sendRSVPNotification(newRSVP);
    
    res.status(201).json({
      success: true,
      message: 'Merci pour votre réponse !',
      data: newRSVP
    });
  } catch (error) {
    console.error('Erreur lors de la soumission RSVP:', error);
    res.status(500).json({ error: 'Erreur lors du traitement de votre réponse' });
  }
};