/**
 * Migration: Create deliveries table
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
module.exports = {
    up: (queryInterface, Sequelize) => __awaiter(this, void 0, void 0, function* () {
        yield queryInterface.createTable('deliveries', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            delivery_number: {
                type: Sequelize.STRING(50),
                allowNull: false,
                unique: true
            },
            order_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'orders',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'RESTRICT'
            },
            delivery_date: {
                type: Sequelize.DATE,
                allowNull: true
            },
            delivery_address: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            delivery_person_name: {
                type: Sequelize.STRING(255),
                allowNull: true
            },
            delivery_person_phone: {
                type: Sequelize.STRING(50),
                allowNull: true
            },
            tracking_number: {
                type: Sequelize.STRING(100),
                allowNull: true
            },
            status: {
                type: Sequelize.ENUM('pending', 'in_transit', 'delivered', 'failed', 'returned'),
                defaultValue: 'pending'
            },
            notes: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            delivered_at: {
                type: Sequelize.DATE,
                allowNull: true
            },
            signature: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            created_by: {
                type: Sequelize.INTEGER,
                allowNull: true
            },
            created_at: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            },
            updated_at: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            }
        });
        yield queryInterface.addIndex('deliveries', ['order_id']);
        yield queryInterface.addIndex('deliveries', ['delivery_number']);
        yield queryInterface.addIndex('deliveries', ['status']);
        yield queryInterface.addIndex('deliveries', ['delivery_date']);
    }),
    down: (queryInterface, Sequelize) => __awaiter(this, void 0, void 0, function* () {
        yield queryInterface.dropTable('deliveries');
    })
};
