const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: false
});

// Test de la connexion à la base de données
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connexion à la base de données établie.');
  } catch (error) {
    console.error('Impossible de se connecter à la base de données:', error);
  }
})();

module.exports = {
  sequelize,
  Sequelize
};