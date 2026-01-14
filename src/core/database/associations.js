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

// Set up User associations for created_by fields (Production)
const { ProductionRun } = require('../../modules/production/production.models');
ProductionRun.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

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
    as: 'assignedStaffMembers'
});

Staff.belongsToMany(SalesRoute, {
    through: SalesRouteStaff,
    foreignKey: 'staff_id',
    otherKey: 'sales_route_id',
    as: 'assignedRoutes'
});

// Set up StaffCheckIn associations
const { StaffCheckIn } = require('../../modules/attendance/checkin.model');
StaffCheckIn.belongsTo(Customer, { foreignKey: 'customer_id', as: 'customer' });
Customer.hasMany(StaffCheckIn, { foreignKey: 'customer_id', as: 'checkins' }); // Added for reverse lookup
StaffCheckIn.belongsTo(Staff, { foreignKey: 'staff_id', as: 'staff' });

// Set up Payroll associations
const { PayrollRun, PayrollItem } = require('../../modules/payroll/payroll.models');

PayrollRun.hasMany(PayrollItem, { foreignKey: 'run_id', as: 'items' });
PayrollItem.belongsTo(PayrollRun, { foreignKey: 'run_id', as: 'run' });

User.hasMany(PayrollItem, { foreignKey: 'staff_id', as: 'payrollItems' });
PayrollItem.belongsTo(User, { foreignKey: 'staff_id', as: 'staff' });

module.exports = {};
