const { DataTypes } = require('sequelize');
const { sequelize } = require('../../core/database/sequelize');

// Define User model
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  role_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'users', // Make sure this matches your MySQL table
  timestamps: false,  // We are not using Sequelize's automatic timestamps
});

const { Role } = require('../roles/role.model');
User.belongsTo(Role, { foreignKey: 'role_id', as: 'role' });

module.exports = { User };
