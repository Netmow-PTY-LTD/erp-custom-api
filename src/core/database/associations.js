// This file sets up associations that might cause circular dependencies
// It should be loaded after all models are defined

const { Payment, Order, Invoice, Delivery, SalesRoute, SalesRouteStaff } = require('../../modules/sales/sales.models');
const { PurchaseOrder, PurchaseInvoice, PurchasePayment, PurchaseReceipt } = require('../../modules/purchase/purchase.models');
const { User } = require('../../modules/users/user.model');
const { Customer } = require('../../modules/customers/customers.model');
const { Staff } = require('../../modules/staffs/staffs.model');

// Set up User associations for created_by fields (Sales)
Payment.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });
Order.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });
Invoice.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });
Delivery.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

// Set up User associations for created_by fields (Purchase)
PurchaseOrder.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });
PurchaseInvoice.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });
PurchasePayment.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });
PurchaseReceipt.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

// Set up Customer to SalesRoute association
Customer.belongsTo(SalesRoute, { foreignKey: 'sales_route_id', as: 'salesRoute' });
SalesRoute.hasMany(Customer, { foreignKey: 'sales_route_id', as: 'customers' });

// Set up Customer to Orders association
Customer.hasMany(Order, { foreignKey: 'customer_id', as: 'orders' });

// Set up SalesRoute to Staff association (Many-to-Many)
SalesRoute.belongsToMany(Staff, {
    through: SalesRouteStaff,
    foreignKey: 'sales_route_id',
    otherKey: 'staff_id',
    as: 'assignedStaff'
});

Staff.belongsToMany(SalesRoute, {
    through: SalesRouteStaff,
    foreignKey: 'staff_id',
    otherKey: 'sales_route_id',
    as: 'assignedRoutes'
});

module.exports = {};
