'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    up(queryInterface, Sequelize) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryInterface.createTable('stock_movements', {
                id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                product_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    references: {
                        model: 'products',
                        key: 'id'
                    },
                    onUpdate: 'CASCADE',
                    onDelete: 'RESTRICT'
                },
                movement_type: {
                    type: Sequelize.ENUM('purchase', 'sale', 'adjustment', 'return', 'transfer'),
                    allowNull: false
                },
                quantity: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    comment: 'Positive for stock in, negative for stock out'
                },
                reference_type: {
                    type: Sequelize.STRING(50),
                    allowNull: true,
                    comment: 'e.g., order, purchase_order, adjustment'
                },
                reference_id: {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                    comment: 'ID of the related transaction'
                },
                notes: {
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
            // Add index for faster queries
            yield queryInterface.addIndex('stock_movements', ['product_id']);
            yield queryInterface.addIndex('stock_movements', ['movement_type']);
            yield queryInterface.addIndex('stock_movements', ['reference_type', 'reference_id']);
        });
    },
    down(queryInterface, Sequelize) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryInterface.dropTable('stock_movements');
        });
    }
};
