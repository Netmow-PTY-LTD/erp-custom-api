/**
 * Migration: Add tax_amount to order_items table
 */

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Add tax_amount column
        await queryInterface.addColumn('order_items', 'tax_amount', {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: true,
            defaultValue: 0.00,
            after: 'line_total'
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('order_items', 'tax_amount');
    }
};
