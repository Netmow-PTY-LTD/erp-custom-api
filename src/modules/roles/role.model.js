const { DataTypes } = require('sequelize');
const { sequelize } = require('../../core/database/sequelize');

// Role model
const Role = sequelize.define('Role', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'roles',
  timestamps: false,
});

// RoleSettings model
const RoleSettings = sequelize.define('RoleSettings', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  role_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  menu: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  dashboard: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  custom: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'role_settings',
  timestamps: false,
});

Role.hasOne(RoleSettings, { foreignKey: 'role_id', sourceKey: 'id' });
RoleSettings.belongsTo(Role, { foreignKey: 'role_id', targetKey: 'id' });

module.exports = { Role, RoleSettings };
