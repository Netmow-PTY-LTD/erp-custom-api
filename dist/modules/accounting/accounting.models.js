const { DataTypes } = require('sequelize');
const { sequelize } = require('../../core/database/sequelize');
// Income Model
const Income = sequelize.define('Income', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        get() {
            const value = this.getDataValue('amount');
            return value === null ? null : parseFloat(value);
        }
    },
    income_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    category: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    credit_head_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    reference_number: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    payment_method: {
        type: DataTypes.STRING(50),
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
    tableName: 'incomes',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});
// Expense Model
const Expense = sequelize.define('Expense', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        get() {
            const value = this.getDataValue('amount');
            return value === null ? null : parseFloat(value);
        }
    },
    expense_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    category: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    debit_head_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    reference_number: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    payment_method: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('pending', 'approved', 'paid', 'rejected'),
        defaultValue: 'pending'
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
    tableName: 'expenses',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});
// Payroll Model
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
    salary_month: {
        type: DataTypes.STRING(7), // YYYY-MM
        allowNull: false
    },
    basic_salary: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        get() {
            const value = this.getDataValue('basic_salary');
            return value === null ? null : parseFloat(value);
        }
    },
    allowances: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00,
        get() {
            const value = this.getDataValue('allowances');
            return value === null ? null : parseFloat(value);
        }
    },
    deductions: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00,
        get() {
            const value = this.getDataValue('deductions');
            return value === null ? null : parseFloat(value);
        }
    },
    net_salary: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        get() {
            const value = this.getDataValue('net_salary');
            return value === null ? null : parseFloat(value);
        }
    },
    payment_date: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('pending', 'processed', 'paid'),
        defaultValue: 'pending'
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
// Credit Head Model
const CreditHead = sequelize.define('CreditHead', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true
    },
    code: {
        type: DataTypes.STRING(50),
        allowNull: true,
        unique: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    parent_id: {
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
    tableName: 'credit_heads',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});
// Debit Head Model
const DebitHead = sequelize.define('DebitHead', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true
    },
    code: {
        type: DataTypes.STRING(50),
        allowNull: true,
        unique: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    parent_id: {
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
    tableName: 'debit_heads',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});
// Define associations
Income.belongsTo(CreditHead, {
    foreignKey: 'credit_head_id',
    as: 'creditHead'
});
Expense.belongsTo(DebitHead, {
    foreignKey: 'debit_head_id',
    as: 'debitHead'
});
module.exports = {
    Income,
    Expense,
    Payroll,
    CreditHead,
    DebitHead
};
