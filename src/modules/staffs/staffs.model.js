const { DataTypes } = require('sequelize');
const { sequelize } = require('../../core/database/sequelize');

const Staff = sequelize.define('Staff', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    first_name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    last_name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true
    },
    phone: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    position: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    department_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    hire_date: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    salary: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        get() {
            const value = this.getDataValue('salary');
            return value === null ? null : parseFloat(value);
        }
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
    status: {
        type: DataTypes.ENUM('active', 'inactive', 'terminated', 'on_leave'),
        defaultValue: 'active'
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    thumb_url: {
        type: DataTypes.STRING(500),
        allowNull: true
    },
    gallery_items: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: null
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
    tableName: 'staffs',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

// Define associations
Staff.associate = (models) => {
    Staff.belongsTo(models.Department, {
        foreignKey: 'department_id',
        as: 'department'
    });
};

module.exports = { Staff };
