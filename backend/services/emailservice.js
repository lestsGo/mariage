const nodemailer = require('nodemailer');
const { google } = require('googleapis');

// Configuration OAuth2 pour Gmail
const OAuth2 = google.auth.OAuth2;

// Création du transporteur avec OAuth2
const createTransporter = async () => {
  const oauth2Client = new OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    "https://developers.google.com/oauthplayground"
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN
  });

  const accessToken = await new Promise((resolve, reject) => {
    oauth2Client.getAccessToken((err, token) => {
      if (err) reject("Failed to create access token");
      resolve(token);
    });
  });

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.GOOGLE_USER,
      accessToken,
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      refreshToken: process.env.GOOGLE_REFRESH_TOKEN
    }
  });
};

exports.sendRSVPNotification = async (rsvp) => {
  try {
    const transporter = await createTransporter();
    
    const attendanceText = rsvp.attendance === 'yes' 
      ? 'a confirmé sa présence 🎉' 
      : 'ne pourra malheureusement pas venir 😢';
    
    const guestsText = rsvp.guests > 0 
      ? `avec ${rsvp.guests} accompagnant${rsvp.guests > 1 ? 's' : ''}` 
      : '';
    
    // Message pour les mariés
    const mailOptions = {
      from: `"Site Mariage" <${process.env.GOOGLE_USER}>`,
      to: process.env.NOTIFICATION_EMAIL,
      subject: `[Mariage] ${rsvp.firstName} ${rsvp.lastName} ${attendanceText.split(' ')[0]}`,
      html: `
        <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; background-color: #FAF7F2; padding: 30px; border-radius: 16px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="font-family: 'Playfair Display', serif; color: #2C3E50; font-size: 28px; margin-bottom: 10px;">
              Nouvelle réponse RSVP
            </h1>
            <p style="color: #666; font-size: 18px;">${rsvp.firstName} ${rsvp.lastName} ${attendanceText} ${guestsText}</p>
          </div>
          
          <div style="background: white; border-radius: 16px; padding: 20px; margin-bottom: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
            <h2 style="font-family: 'Playfair Display', serif; color: #2C3E50; border-bottom: 2px solid #D4AF37; padding-bottom: 10px; margin-bottom: 20px;">
              Détails de la réponse
            </h2>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
              <div>
                <p style="font-weight: 600; margin-bottom: 5px;">Nom</p>
                <p>${rsvp.firstName} ${rsvp.lastName}</p>
              </div>
              <div>
                <p style="font-weight: 600; margin-bottom: 5px;">Email</p>
                <p>${rsvp.email}</p>
              </div>
            </div>
            
            ${rsvp.dietary ? `
            <div style="margin-bottom: 20px;">
              <p style="font-weight: 600; margin-bottom: 5px;">Régimes/Allergies</p>
              <p>${rsvp.dietary}</p>
            </div>
            ` : ''}
            
            ${rsvp.message ? `
            <div>
              <p style="font-weight: 600; margin-bottom: 5px;">Message</p>
              <p style="font-style: italic;">"${rsvp.message}"</p>
            </div>
            ` : ''}
          </div>
          
          <div style="text-align: center; color: #666; font-size: 14px; margin-top: 30px;">
            <p>Vous pouvez consulter toutes les réponses sur votre <a href="${process.env.ADMIN_URL}" style="color: #D4AF37; text-decoration: none; font-weight: 600;">interface d'administration</a></p>
            <p style="margin-top: 10px;">© Marie & Pierre - Mariage 2024</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Notification email envoyée avec succès');
    
    // Message de confirmation pour l'invité (si présent)
    if (rsvp.attendance === 'yes') {
      const guestMailOptions = {
        from: `"Marie & Pierre" <${process.env.GOOGLE_USER}>`,
        to: rsvp.email,
        subject: 'Confirmation de votre présence à notre mariage',
        html: `
          <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; background-color: #FAF7F2; padding: 30px; border-radius: 16px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="font-family: 'Playfair Display', serif; color: #2C3E50; font-size: 28px; margin-bottom: 10px;">
                Confirmation reçue !
              </h1>
              <p style="color: #666; font-size: 18px;">Merci ${rsvp.firstName} d'avoir confirmé votre présence</p>
            </div>
            
            <div style="background: white; border-radius: 16px; padding: 20px; margin-bottom: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
              <p style="margin-bottom: 20px;">Bonjour ${rsvp.firstName},</p>
              
              <p>Nous avons bien reçu votre confirmation de présence pour notre mariage le <strong>15 juin 2024</strong> au Château de Versailles.</p>
              
              ${rsvp.guests > 0 ? `
              <p style="margin-top: 15px;">Vos ${rsvp.guests} accompagnant${rsvp.guests > 1 ? 's' : ''} sont également inscrit${rsvp.guests > 1 ? 's' : ''}.</p>
              ` : ''}
              
              ${rsvp.dietary ? `
              <p style="margin-top: 15px;">
                Nous avons bien noté vos préférences alimentaires: <strong>${rsvp.dietary}</strong>
              </p>
              ` : ''}
              
              <p style="margin-top: 20px;">Pour toute question, n'hésitez pas à nous contacter à l'adresse: <a href="mailto:marie.pierre.mariage@email.com" style="color: #D4AF37;">marie.pierre.mariage@email.com</a></p>
              
              <p style="margin-top: 30px; text-align: center;">
                <a href="${process.env.WEDDING_WEBSITE}" style="display: inline-block; background: #D4AF37; color: white; padding: 12px 24px; border-radius: 12px; text-decoration: none; font-weight: 500;">
                  Voir le site du mariage
                </a>
              </p>
            </div>
            
            <div style="text-align: center; color: #666; font-size: 14px; margin-top: 30px;">
              <p>A très bientôt,</p>
              <p style="font-family: 'Playfair Display', serif; font-size: 22px; margin-top: 10px; color: #2C3E50;">
                Marie & Pierre
              </p>
            </div>
          </div>
        `
      };
      
      await transporter.sendMail(guestMailOptions);
      console.log('Email de confirmation envoyé à l\'invité');
    }
  } catch (error) {
    console.error('Erreur lors de l\'envoi des emails:', error);
    throw error;
  }
};