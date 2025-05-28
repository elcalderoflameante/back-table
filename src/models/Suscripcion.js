const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Suscripcion = sequelize.define('Suscripcion', {
  endpoint: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  keys: {
    type: DataTypes.JSONB,
    allowNull: false
  }
}, {
  tableName: 'suscripciones',
  timestamps: false,
});

module.exports = Suscripcion;