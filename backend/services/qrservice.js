const QRCode = require('qrcode');

exports.generateQRCode = async (url) => {
  try {
    // Générer le QR code en base64
    const qrCode = await QRCode.toDataURL(url, {
      width: 400,
      margin: 2,
      color: {
        dark: '#2C3E50',
        light: '#FAF7F2'
      }
    });
    
    return qrCode;
  } catch (error) {
    console.error('Erreur lors de la génération du QR code:', error);
    throw error;
  }
};