/**
 * Test script for the updated Sales APIs with datewise filters
 * 
 * APIs to test:
 * 1. GET /api/reports/sales/summary?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD
 * 2. GET /api/sales/reports/charts?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD
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

async function testSalesSummary() {
    console.log('\n=== Testing GET /api/reports/sales/summary ===');

    try {
        const response = await axios.get(
            `${BASE_URL}/reports/sales/summary`,
            {
                ...config,
                params: {
                    start_date: '2025-01-01',
                    end_date: '2025-12-31'
                }
            }
        );

        console.log('✅ Sales Summary API Response:');
        console.log(JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.error('❌ Sales Summary API Error:');
        console.error(error.response?.data || error.message);
    }
}

async function testSalesCharts() {
    console.log('\n=== Testing GET /api/sales/reports/charts ===');

    try {
        const response = await axios.get(
            `${BASE_URL}/sales/reports/charts`,
            {
                ...config,
                params: {
                    start_date: '2025-12-01',
                    end_date: '2025-12-31'
                }
            }
        );

        console.log('✅ Sales Charts API Response:');
        console.log(JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.error('❌ Sales Charts API Error:');
        console.error(error.response?.data || error.message);
    }
}

async function testMissingParameters() {
    console.log('\n=== Testing Missing Parameters ===');

    try {
        // Test without start_date
        await axios.get(
            `${BASE_URL}/reports/sales/summary`,
            {
                ...config,
                params: {
                    end_date: '2025-12-31'
                }
            }
        );
    } catch (error) {
        console.log('✅ Correctly rejected request without start_date:');
        console.log(error.response?.data || error.message);
    }

    try {
        // Test without end_date
        await axios.get(
            `${BASE_URL}/sales/reports/charts`,
            {
                ...config,
                params: {
                    start_date: '2025-01-01'
                }
            }
        );
    } catch (error) {
        console.log('✅ Correctly rejected request without end_date:');
        console.log(error.response?.data || error.message);
    }
}

async function runAllTests() {
    console.log('Starting Sales API Tests with Datewise Filters...\n');

    await testSalesSummary();
    await testSalesCharts();
    await testMissingParameters();

    console.log('\n=== All Tests Completed ===\n');
}

// Run tests
runAllTests().catch(console.error);
