const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');  // Asegúrate de que la ruta sea correcta

const Solicitud = sequelize.define('Solicitud', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  mesa: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  tipo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  estado: {
    type: DataTypes.ENUM('nuevo', 'proceso', 'atendido'),
    defaultValue: 'nuevo',
    validate: {
      isIn: [['nuevo', 'proceso', 'atendido']]
    }
  },
  fecha_creacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  fecha_respuesta: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  fecha_cierre: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'solicitudes',  // Nombre de la tabla en PostgreSQL
  timestamps: false,        // Desactiva los campos createdAt y updatedAt
});

module.exports = Solicitud;