/**
 * Migration: Add sales_tax_percent to order_items table
 */

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Add sales_tax_percent column
        await queryInterface.addColumn('order_items', 'sales_tax_percent', {
            type: Sequelize.DECIMAL(5, 2),
            allowNull: true,
            defaultValue: 0.00,
            after: 'tax_amount'
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('order_items', 'sales_tax_percent');
    }
};
