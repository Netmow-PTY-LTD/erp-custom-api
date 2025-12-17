const { InvoiceRepository, OrderRepository } = require('./src/modules/sales/sales.repository');
const { sequelize } = require('./src/core/database/sequelize');

async function run() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        // Check Order 5
        const order = await OrderRepository.findById(5);
        if (order) {
            console.log('Order 5 found.');
            if (order.invoice) {
                console.log('Order 5 has invoice:', order.invoice.id, order.invoice.invoice_number);
            } else {
                console.log('Order 5 has NO invoice in the association.');
            }
        } else {
            console.log('Order 5 not found.');
        }

        // List all invoices
        const { Invoice } = require('./src/modules/sales/sales.models');
        const invoices = await Invoice.findAll();
        console.log(`Total invoices: ${invoices.length}`);
        invoices.forEach(inv => {
            console.log(`Invoice ${inv.id} for Order ${inv.order_id}`);
        });

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
    }
}

run();
