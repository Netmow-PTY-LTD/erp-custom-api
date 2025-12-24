/**
 * Migration: Add head foreign keys to incomes and expenses
 * Adds credit_head_id to incomes and debit_head_id to expenses
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
        // Add credit_head_id to incomes table
        yield queryInterface.addColumn('incomes', 'credit_head_id', {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: 'credit_heads',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
            after: 'category'
        });
        // Add debit_head_id to expenses table
        yield queryInterface.addColumn('expenses', 'debit_head_id', {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: 'debit_heads',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
            after: 'category'
        });
        // Add indexes
        yield queryInterface.addIndex('incomes', ['credit_head_id']);
        yield queryInterface.addIndex('expenses', ['debit_head_id']);
    }),
    down: (queryInterface, Sequelize) => __awaiter(this, void 0, void 0, function* () {
        yield queryInterface.removeColumn('incomes', 'credit_head_id');
        yield queryInterface.removeColumn('expenses', 'debit_head_id');
    })
};
