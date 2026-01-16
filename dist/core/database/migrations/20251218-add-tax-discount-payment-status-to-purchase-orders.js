/**
 * Migration: Add tax_amount, discount_amount, and payment_status to purchase_orders table
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
        // Add tax_amount column
        yield queryInterface.addColumn('purchase_orders', 'tax_amount', {
            type: Sequelize.DECIMAL(10, 2),
            defaultValue: 0.00,
            after: 'total_amount'
        });
        // Add discount_amount column
        yield queryInterface.addColumn('purchase_orders', 'discount_amount', {
            type: Sequelize.DECIMAL(10, 2),
            defaultValue: 0.00,
            after: 'tax_amount'
        });
        // Add payment_status column
        yield queryInterface.addColumn('purchase_orders', 'payment_status', {
            type: Sequelize.ENUM('unpaid', 'partially_paid', 'paid'),
            defaultValue: 'unpaid',
            after: 'discount_amount'
        });
    }),
    down: (queryInterface, Sequelize) => __awaiter(this, void 0, void 0, function* () {
        yield queryInterface.removeColumn('purchase_orders', 'tax_amount');
        yield queryInterface.removeColumn('purchase_orders', 'discount_amount');
        yield queryInterface.removeColumn('purchase_orders', 'payment_status');
    })
};
