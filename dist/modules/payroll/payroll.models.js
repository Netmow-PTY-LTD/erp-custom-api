const { DataTypes } = require('sequelize');
const { sequelize } = require('../../core/database/sequelize');
const Payroll = sequelize.define('Payroll', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    staff_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    month: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    year: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    basic_salary: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
    },
    allowances: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: {}
    },
    deductions: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: {}
    },
    net_salary: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
    },
    payment_date: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('pending', 'paid', 'cancelled'),
        defaultValue: 'pending'
    },
    payment_method: {
        type: DataTypes.ENUM('bank_transfer', 'cash', 'cheque'),
        allowNull: true
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    created_by: {
        type: DataTypes.INTEGER,
        allowNull: true
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
    tableName: 'payrolls',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});
// Association is defined in repository or main models file usually, 
// but for modularity we can export it here and setup in app init if needed.
// For now, we'll rely on foreign keys.
module.exports = { Payroll };
