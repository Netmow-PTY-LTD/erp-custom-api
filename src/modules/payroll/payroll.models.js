const { DataTypes } = require('sequelize');
const { sequelize } = require('../../core/database/sequelize');

// PayrollRun Model
const PayrollRun = sequelize.define('PayrollRun', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    month: {
        type: DataTypes.STRING(20), // E.g., "2025-01"
        allowNull: false
    },
    total_gross: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0.00
    },
    total_net: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0.00
    },
    status: {
        type: DataTypes.ENUM('pending', 'approved', 'paid'),
        defaultValue: 'pending'
    },
    payment_date: {
        type: DataTypes.DATEONLY,
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
    tableName: 'payroll_runs',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

// PayrollItem Model
const PayrollItem = sequelize.define('PayrollItem', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    run_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    staff_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    basic_salary: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
    },
    allowances: {
        type: DataTypes.JSON, // Stores { "HRA": 500, "Transport": 200 }
        allowNull: true,
        defaultValue: {}
    },
    deductions: {
        type: DataTypes.JSON, // Stores { "Tax": 100, "EPF": 50 }
        allowNull: true,
        defaultValue: {}
    },
    gross_pay: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
    },
    net_pay: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
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
    tableName: 'payroll_items',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = { PayrollRun, PayrollItem };
