const { DataTypes } = require('sequelize');
const { sequelize } = require('../../core/database/sequelize');
const Customer = sequelize.define('Customer', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: true
    },
    phone: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    company: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    address: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    city: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    state: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    country: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    postal_code: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    latitude: {
        type: DataTypes.DECIMAL(10, 8),
        allowNull: true,
        get() {
            const value = this.getDataValue('latitude');
            return value === null ? null : parseFloat(value);
        }
    },
    longitude: {
        type: DataTypes.DECIMAL(11, 8),
        allowNull: true,
        get() {
            const value = this.getDataValue('longitude');
            return value === null ? null : parseFloat(value);
        }
    },
    tax_id: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    credit_limit: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0.00,
        get() {
            const value = this.getDataValue('credit_limit');
            return value === null ? null : parseFloat(value);
        }
    },
    outstanding_balance: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0.00,
        get() {
            const value = this.getDataValue('outstanding_balance');
            return value === null ? null : parseFloat(value);
        }
    },
    customer_type: {
        type: DataTypes.ENUM('individual', 'company'),
        defaultValue: 'individual'
    },
    sales_route_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    created_by: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'customers',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});
module.exports = { Customer };
