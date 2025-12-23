/**
 * Test script for Low Stock List API
 * Endpoint: GET /api/reports/inventory/low-stock-list
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';
const TOKEN = 'YOUR_AUTH_TOKEN_HERE'; // Replace with actual token

// Test configuration
const config = {
    headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'application/json'
    }
};

async function testLowStockList() {
    console.log('\n=== Testing GET /api/reports/inventory/low-stock-list ===');

    try {
        const response = await axios.get(
            `${BASE_URL}/reports/inventory/low-stock-list`,
            config
        );

        console.log('✅ Low Stock List API Response:');
        console.log(JSON.stringify(response.data, null, 2));

        // Validation check
        if (response.data.status === true && Array.isArray(response.data.data)) {
            const firstItem = response.data.data[0];
            if (firstItem && 'sku' in firstItem && 'product' in firstItem && 'stock' in firstItem && 'minLevel' in firstItem) {
                console.log('✅ Data format is correct!');
            } else if (response.data.data.length === 0) {
                console.log('⚠️ No low stock items found (data array empty).');
            } else {
                console.log('❌ Data format mismatch');
            }
        } else {
            console.log('❌ Invalid response structure');
        }

    } catch (error) {
        console.error('❌ Low Stock List API Error:');
        console.error(error.response?.data || error.message);
    }
}

testLowStockList().catch(console.error);
