/**
 * Test script for Date Filtering on Reports
 * Endpoints:
 * 1. GET /api/reports/sales/by-customer
 * 2. GET /api/reports/customers/account-receivables
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

async function testDatewiseReports() {
    console.log('\n=== Testing Datewise Reports ===');

    // Set a date range (modify as needed for your data)
    const startDate = '2024-01-01';
    const endDate = '2024-12-31';

    // 1. Test Sales By Customer
    try {
        console.log(`\nTesting Sales By Customer (${startDate} to ${endDate})...`);
        const response1 = await axios.get(
            `${BASE_URL}/reports/sales/by-customer?startDate=${startDate}&endDate=${endDate}&page=1&limit=5`,
            config
        );
        console.log('✅ Sales By Customer Response OK');
        console.log(`   Count: ${response1.data.data.length} items`);

    } catch (error) {
        console.error('❌ Sales By Customer Error:', error.response?.data || error.message);
    }

    // 2. Test Account Receivables
    try {
        console.log(`\nTesting Account Receivables (${startDate} to ${endDate})...`);
        const response2 = await axios.get(
            `${BASE_URL}/reports/customers/account-receivables?startDate=${startDate}&endDate=${endDate}&page=1&limit=5`,
            config
        );

        console.log('✅ Account Receivables Response OK');
        console.log(`   Count: ${response2.data.data.length} items`);

        // Verify dates in response are within range
        const data = response2.data.data;
        if (data.length > 0) {
            let allInRange = true;
            data.forEach(item => {
                const itemDate = new Date(item.date);
                const start = new Date(startDate);
                const end = new Date(endDate);
                if (itemDate < start || itemDate > end) {
                    allInRange = false;
                    console.log(`   ⚠️ Found item out of range: ${item.date}`);
                }
            });

            if (allInRange) {
                console.log('   ✅ All items date validated within range.');
            }
        }

    } catch (error) {
        console.error('❌ Account Receivables Error:', error.response?.data || error.message);
    }
}

testDatewiseReports().catch(console.error);
