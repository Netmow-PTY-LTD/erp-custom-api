/**
 * Migration: Add purchase_tax_percent to purchase_order_items table
 */

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Add purchase_tax_percent column
        await queryInterface.addColumn('purchase_order_items', 'purchase_tax_percent', {
            type: Sequelize.DECIMAL(5, 2),
            allowNull: true,
            defaultValue: 0.00,
            after: 'tax_amount'
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('purchase_order_items', 'purchase_tax_percent');
    }
};
