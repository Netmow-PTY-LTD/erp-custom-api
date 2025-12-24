/**
 * Test script for Low Stock List API (with Pagination)
 * Endpoint: GET /api/reports/inventory/low-stock-list?page=1&limit=5
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

async function testLowStockListPagination() {
    console.log('\n=== Testing GET /api/reports/inventory/low-stock-list (Paginated) ===');

    try {
        const response = await axios.get(
            `${BASE_URL}/reports/inventory/low-stock-list?page=1&limit=5`,
            config
        );

        console.log('✅ Low Stock List API Response:');
        console.log(JSON.stringify(response.data, null, 2));

        // Validation check
        if (response.data.status === true && response.data.pagination) {
            const pagination = response.data.pagination;
            if ('total' in pagination && 'page' in pagination && 'limit' in pagination) {
                console.log('✅ Pagination structure is correct!');
                console.log(`Total Items: ${pagination.total}, Current Page: ${pagination.page}, Items per Page: ${pagination.limit}`);
            } else {
                console.log('❌ Pagination structure mismatch');
            }

            if (Array.isArray(response.data.data)) {
                console.log(`✅ Data array retrieved with ${response.data.data.length} items`);
            }
        } else {
            console.log('❌ Invalid response structure (missing pagination)');
        }

    } catch (error) {
        console.error('❌ Low Stock List API Error:');
        console.error(error.response?.data || error.message);
    }
}

testLowStockListPagination().catch(console.error);
