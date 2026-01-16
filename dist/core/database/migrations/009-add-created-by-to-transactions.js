/**
 * Migration: Add created_by to all transaction tables
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
        const tables = [
            'products',
            'customers',
            'suppliers',
            'orders',
            'invoices',
            'payments',
            'incomes',
            'expenses',
            'payrolls'
        ];
        for (const table of tables) {
            yield queryInterface.addColumn(table, 'created_by', {
                type: Sequelize.INTEGER,
                allowNull: true, // Nullable for existing records
                // references: { model: 'users', key: 'id' } // Uncomment if users table exists and you want FK constraint
            });
            yield queryInterface.addIndex(table, ['created_by']);
        }
    }),
    down: (queryInterface, Sequelize) => __awaiter(this, void 0, void 0, function* () {
        const tables = [
            'products',
            'customers',
            'suppliers',
            'orders',
            'invoices',
            'payments',
            'incomes',
            'expenses',
            'payrolls'
        ];
        for (const table of tables) {
            yield queryInterface.removeColumn(table, 'created_by');
        }
    })
};
