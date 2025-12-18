/**
 * Migration: Add tax_amount, discount_amount, and payment_status to purchase_orders table
 */

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Add tax_amount column
        await queryInterface.addColumn('purchase_orders', 'tax_amount', {
            type: Sequelize.DECIMAL(10, 2),
            defaultValue: 0.00,
            after: 'total_amount'
        });

        // Add discount_amount column
        await queryInterface.addColumn('purchase_orders', 'discount_amount', {
            type: Sequelize.DECIMAL(10, 2),
            defaultValue: 0.00,
            after: 'tax_amount'
        });

        // Add payment_status column
        await queryInterface.addColumn('purchase_orders', 'payment_status', {
            type: Sequelize.ENUM('unpaid', 'partially_paid', 'paid'),
            defaultValue: 'unpaid',
            after: 'discount_amount'
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('purchase_orders', 'tax_amount');
        await queryInterface.removeColumn('purchase_orders', 'discount_amount');
        await queryInterface.removeColumn('purchase_orders', 'payment_status');
    }
};
