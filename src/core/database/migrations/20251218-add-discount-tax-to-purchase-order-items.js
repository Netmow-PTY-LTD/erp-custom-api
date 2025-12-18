/**
 * Migration: Add discount and tax_amount to purchase_order_items table
 */

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Add discount column
        await queryInterface.addColumn('purchase_order_items', 'discount', {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: true,
            defaultValue: 0.00,
            after: 'unit_cost'
        });

        // Add tax_amount column
        await queryInterface.addColumn('purchase_order_items', 'tax_amount', {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: true,
            defaultValue: 0.00,
            after: 'line_total'
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('purchase_order_items', 'discount');
        await queryInterface.removeColumn('purchase_order_items', 'tax_amount');
    }
};
