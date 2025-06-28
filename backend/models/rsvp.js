module.exports = (sequelize, DataTypes) => {
  const RSVP = sequelize.define('RSVP', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    attendance: {
      type: DataTypes.ENUM('yes', 'no'),
      allowNull: false
    },
    guests: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    dietary: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'rsvps',
    timestamps: false
  });

  return RSVP;
};