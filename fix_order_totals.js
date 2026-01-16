const { sequelize } = require('./src/core/database/sequelize');
const { Order, OrderItem } = require('./src/modules/sales/sales.models');

async function fixOrderTotals() {
    try {
        console.log('🔄 Recalculating order totals (sum of total_price)...');

        const orders = await Order.findAll({
            include: [{ model: OrderItem, as: 'items' }]
        });

        for (const order of orders) {
            if (!order.items || order.items.length === 0) continue;

            // Sum of total_price (before discount)
            const calculatedTotal = order.items.reduce((sum, item) => {
                return sum + (parseFloat(item.total_price) || 0);
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

        console.log('✨ Order totals recalculated!');

    } catch (err) {
        console.error('❌ Error:', err);
    } finally {
        await sequelize.close();
    }
}

fixOrderTotals();
