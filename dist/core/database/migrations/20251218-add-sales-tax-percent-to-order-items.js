/**
 * Migration: Add sales_tax_percent to order_items table
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
        // Add sales_tax_percent column
        yield queryInterface.addColumn('order_items', 'sales_tax_percent', {
            type: Sequelize.DECIMAL(5, 2),
            allowNull: true,
            defaultValue: 0.00,
            after: 'tax_amount'
        });
    }),
    down: (queryInterface, Sequelize) => __awaiter(this, void 0, void 0, function* () {
        yield queryInterface.removeColumn('order_items', 'sales_tax_percent');
    })
};
