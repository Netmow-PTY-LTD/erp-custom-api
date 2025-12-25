const { sequelize } = require('./src/core/database/sequelize');
const { Order, OrderItem } = require('./src/modules/sales/sales.models');

async function recalculateOrders() {
    try {
        console.log('🔄 Recalculating Order Totals from Items...');

        const orders = await Order.findAll({
            include: [{ model: OrderItem, as: 'items' }]
        });

        for (const order of orders) {
            let calculatedTotal = 0;
            let calculatedTax = 0;
            let calculatedItemDiscount = 0;

            if (order.items && order.items.length > 0) {
                // Determine if we should trust existing item totals or recalculate them too
                // Let's recalculate line totals to be safe: (qty * unit) - disc
                for (const item of order.items) {
                    const qty = parseFloat(item.quantity) || 0;
                    const price = parseFloat(item.unit_price) || 0;
                    const disc = parseFloat(item.discount) || 0;
                    const tax = parseFloat(item.tax_amount) || 0;

                    // Standard Logic: Line Total = (Price * Qty) - Discount
                    const subtotal = price * qty;
                    const lineTotal = subtotal - disc;

                    // Update item if it looks wrong? 
                    // optional: await item.update({ line_total: lineTotal, total_price: lineTotal });

                    calculatedTotal += lineTotal;
                    calculatedTax += tax;
                    calculatedItemDiscount += disc;
                }
            }

            // Order level tax might include order-specific tax % logic
            // But usually order.tax_amount should be sum of items tax + order global tax.
            // If we assume sales_tax_percent on order applies to the whole subtotal...
            // For this fix, let's assume item taxes are the source of truth for now + check order sales_tax_percent.

            // If order has sales_tax_percent, we might need to add that on top of item taxes?
            // createOrder logic: item_level_tax + order_level_tax.
            let orderLevelTax = 0;
            if (order.sales_tax_percent > 0) {
                orderLevelTax = (calculatedTotal * order.sales_tax_percent) / 100;
            }

            const finalTax = calculatedTax + orderLevelTax; // Note: if calculatedTax included item taxes, this is right. 

            // Only update if different (to save DB writes/logs, though safe to overwrite)
            // But we must fix the specific case where total_amount is wrong.

            // Check if updates needed
            if (Math.abs(order.total_amount - calculatedTotal) > 0.01 || Math.abs(order.tax_amount - finalTax) > 0.01) {
                console.log(`⚠️ Order ${order.id} (${order.order_number}) Mismatch:`);
                console.log(`   Current: Total=${order.total_amount}, Tax=${order.tax_amount}`);
                console.log(`   Calculated: Total=${calculatedTotal}, Tax=${finalTax}`);

                await order.update({
                    total_amount: calculatedTotal,
                    tax_amount: finalTax
                });
                console.log(`   ✅ Fixed.`);
            }
        }

        console.log('✨ Order recalculation complete.');

    } catch (err) {
        console.error('❌ Error:', err);
    } finally {
        await sequelize.close();
    }
}

recalculateOrders();
