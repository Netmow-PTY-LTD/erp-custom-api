/**
 * Test script for Inventory Valuation API
 * Endpoint: GET /api/reports/inventory/valuation
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

async function testInventoryValuation() {
    console.log('\n=== Testing GET /api/reports/inventory/valuation ===');

    try {
        const response = await axios.get(
            `${BASE_URL}/reports/inventory/valuation`,
            config
        );

        console.log('✅ Inventory Valuation API Response:');
        console.log(JSON.stringify(response.data, null, 2));

        // Validation check
        if (response.data.status === true && response.data.data) {
            const data = response.data.data;
            if ('total_units' in data && 'total_Valuation' in data && 'potential_Sales_Value' in data) {
                console.log('✅ Data format is correct!');
            } else {
                console.log('❌ Data format mismatch. Keys found:', Object.keys(data));
            }
        } else {
            console.log('❌ Invalid response structure');
        }

    } catch (error) {
        console.error('❌ Inventory Valuation API Error:');
        console.error(error.response?.data || error.message);
    }
}

testInventoryValuation().catch(console.error);
