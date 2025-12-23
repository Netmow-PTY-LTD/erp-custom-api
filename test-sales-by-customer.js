/**
 * Test script for Sales By Customer API
 * Endpoint: GET /api/reports/sales/by-customer
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

async function testSalesByCustomer() {
    console.log('\n=== Testing GET /api/reports/sales/by-customer ===');

    // Set date range for data (adjust as needed for your test data)
    const startDate = '2020-01-01'; // Broad range to ensure we capture test data
    const endDate = new Date().toISOString().split('T')[0];

    try {
        const response = await axios.get(
            `${BASE_URL}/reports/sales/by-customer?startDate=${startDate}&endDate=${endDate}&page=1&limit=5`,
            config
        );

        console.log('✅ Sales By Customer API Response:');
        console.log(JSON.stringify(response.data, null, 2));

        // Validation check
        if (response.data.success === true && response.data.data) {
            const data = response.data.data;
            if (Array.isArray(data)) {
                // Check if data items have expected keys
                if (data.length > 0) {
                    const firstItem = data[0];
                    if ('customer' in firstItem && 'orders' in firstItem && 'sales' in firstItem) {
                        console.log('✅ Data format is correct!');
                    } else {
                        console.log('❌ Data item structure mismatch. Keys:', Object.keys(firstItem));
                    }
                } else {
                    console.log('⚠️ No sales data found (empty array), but structure seems valid.');
                }
            } else {
                console.log('❌ Data is not an array');
            }
        } else {
            console.log('❌ Invalid response structure');
        }

    } catch (error) {
        console.error('❌ Sales By Customer API Error:');
        console.error(error.response?.data || error.message);
    }
}

testSalesByCustomer().catch(console.error);
