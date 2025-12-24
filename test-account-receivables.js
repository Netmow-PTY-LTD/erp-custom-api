/**
 * Test script for Account Receivables API
 * Endpoint: GET /api/reports/customers/account-receivables
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

async function testAccountReceivables() {
    console.log('\n=== Testing GET /api/reports/customers/account-receivables ===');

    try {
        const response = await axios.get(
            `${BASE_URL}/reports/customers/account-receivables?page=1&limit=10`,
            config
        );

        console.log('✅ Account Receivables API Response:');
        console.log(JSON.stringify(response.data, null, 2));

        // Validation check
        if (response.data.success === true && response.data.pagination) {
            console.log('✅ Pagination structure is valid');

            const data = response.data.data;
            if (Array.isArray(data)) {
                if (data.length > 0) {
                    const firstItem = data[0];
                    const requiredKeys = ['invoiceNumber', 'customer', 'date', 'due', 'total', 'paid', 'balance'];
                    const missingKeys = requiredKeys.filter(key => !(key in firstItem));

                    if (missingKeys.length === 0) {
                        console.log('✅ Data format is correct! Contains all required fields.');
                    } else {
                        console.log('❌ Data item structure mismatch. Missing keys:', missingKeys);
                    }
                } else {
                    console.log('⚠️ No receivables found (empty array), but structure seems valid.');
                }
            } else {
                console.log('❌ Data is not an array');
            }
        } else {
            console.log('❌ Invalid response structure (missing pagination or success flag)');
        }

    } catch (error) {
        console.error('❌ Account Receivables API Error:');
        console.error(error.response?.data || error.message);
    }
}

testAccountReceivables().catch(console.error);
