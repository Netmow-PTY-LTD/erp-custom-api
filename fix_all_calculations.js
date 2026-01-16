const { sequelize } = require('./src/core/database/sequelize');
const { Order, OrderItem } = require('./src/modules/sales/sales.models');

async function fixItemCalculations() {
    try {
        console.log('🔧 Fixing item calculations...');

        const items = await OrderItem.findAll();

        for (const item of items) {
            const quantity = parseFloat(item.quantity) || 0;
            const unitPrice = parseFloat(item.unit_price) || 0;
            const discount = parseFloat(item.discount) || 0;

            // Correct calculations
            const totalPrice = quantity * unitPrice; // Before discount
            const lineTotal = totalPrice - discount; // After discount

            // Check if update needed
            if (Math.abs(item.total_price - totalPrice) > 0.01 || Math.abs(item.line_total - lineTotal) > 0.01) {
                console.log(`⚠️ Item ${item.id} (Order ${item.order_id}):`);
                console.log(`   Current: total_price=${item.total_price}, line_total=${item.line_total}`);
                console.log(`   Calculated: total_price=${totalPrice}, line_total=${lineTotal}`);

                await item.update({
                    total_price: totalPrice,
                    line_total: lineTotal
                });
                console.log(`   ✅ Fixed.`);
            }
        }

        console.log('\n🔄 Recalculating order totals...');

        const orders = await Order.findAll({
            include: [{ model: OrderItem, as: 'items' }]
        });

        for (const order of orders) {
            if (!order.items || order.items.length === 0) continue;

            // Sum of line_total (after discount)
            const calculatedTotal = order.items.reduce((sum, item) => {
                return sum + (parseFloat(item.line_total) || 0);
            }, 0);

            // Sum of item tax
            const calculatedItemTax = order.items.reduce((sum, item) => {
                return sum + (parseFloat(item.tax_amount) || 0);
            }, 0);

            // Order level tax (if sales_tax_percent exists)
            let orderLevelTax = 0;
            if (order.sales_tax_percent > 0) {
                orderLevelTax = (calculatedTotal * order.sales_tax_percent) / 100;
            }

            const finalTax = calculatedItemTax + orderLevelTax;

            // Sum of discounts
            const totalDiscount = order.items.reduce((sum, item) => {
                return sum + (parseFloat(item.discount) || 0);
            }, 0);

            if (Math.abs(order.total_amount - calculatedTotal) > 0.01 ||
                Math.abs(order.tax_amount - finalTax) > 0.01 ||
                Math.abs(order.discount_amount - totalDiscount) > 0.01) {

                console.log(`⚠️ Order ${order.id} (${order.order_number}):`);
                console.log(`   Current: total=${order.total_amount}, tax=${order.tax_amount}, discount=${order.discount_amount}`);
                console.log(`   Calculated: total=${calculatedTotal}, tax=${finalTax}, discount=${totalDiscount}`);

                await order.update({
                    total_amount: calculatedTotal,
                    tax_amount: finalTax,
                    discount_amount: totalDiscount
                });
                console.log(`   ✅ Fixed.`);
            }
        }

        console.log('✨ All calculations fixed!');

    } catch (err) {
        console.error('❌ Error:', err);
    } finally {
        await sequelize.close();
    }
}

fixItemCalculations();
