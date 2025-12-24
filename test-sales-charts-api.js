/**
 * Test script for Sales Reports Charts API
 * 
 * This script demonstrates how to use the /api/sales/reports/charts endpoint
 * with different time periods.
 */

const BASE_URL = 'http://localhost:5000/api/sales/reports/charts';

// Sample data format that the API returns
const sampleMonthlyData = {
    period: 'monthly',
    year: 2025,
    month: null,
    quarter: null,
    data: [
        { date: '2025-01', amount: 1200, order_count: 5 },
        { date: '2025-02', amount: 1500, order_count: 7 },
        { date: '2025-03', amount: 900, order_count: 4 },
        { date: '2025-04', amount: 1800, order_count: 8 },
        { date: '2025-05', amount: 2000, order_count: 9 },
        { date: '2025-06', amount: 1700, order_count: 7 },
        { date: '2025-07', amount: 2200, order_count: 10 },
        { date: '2025-08', amount: 1900, order_count: 8 },
        { date: '2025-09', amount: 2100, order_count: 9 },
        { date: '2025-10', amount: 2300, order_count: 11 },
        { date: '2025-11', amount: 2500, order_count: 12 },
        { date: '2025-12', amount: 2000, order_count: 9 }
    ]
};

const sampleWeeklyData = {
    period: 'weekly',
    year: 2025,
    month: 12,
    quarter: null,
    data: [
        { date: '2025-W48', amount: 400, order_count: 2 },
        { date: '2025-W49', amount: 500, order_count: 3 },
        { date: '2025-W50', amount: 600, order_count: 2 },
        { date: '2025-W51', amount: 300, order_count: 1 },
        { date: '2025-W52', amount: 200, order_count: 1 }
    ]
};

const sampleQuarterlyData = {
    period: 'quarterly',
    year: 2025,
    month: null,
    quarter: null,
    data: [
        { date: 'Q1', amount: 3600, order_count: 16 },
        { date: 'Q2', amount: 5500, order_count: 24 },
        { date: 'Q3', amount: 6200, order_count: 27 },
        { date: 'Q4', amount: 6800, order_count: 32 }
    ]
};

const sampleYearlyData = {
    period: 'yearly',
    year: 2025,
    month: null,
    quarter: null,
    data: [
        { date: '2021', amount: 15000, order_count: 65 },
        { date: '2022', amount: 18000, order_count: 78 },
        { date: '2023', amount: 20000, order_count: 85 },
        { date: '2024', amount: 21000, order_count: 92 },
        { date: '2025', amount: 22100, order_count: 99 }
    ]
};

/**
 * Example function to fetch chart data
 * @param {string} period - 'monthly', 'weekly', 'quarterly', or 'yearly'
 * @param {number} year - Year for the data
 * @param {number|null} month - Month for weekly data (1-12)
 * @param {string} token - JWT authentication token
 */
async function fetchChartData(period = 'monthly', year = 2025, month = null, token = null) {
    const params = new URLSearchParams({ period, year: year.toString() });
    if (month) params.append('month', month.toString());

    const url = `${BASE_URL}?${params}`;

    console.log(`\n📊 Fetching ${period} data for ${year}${month ? ` (month: ${month})` : ''}...`);
    console.log(`URL: ${url}\n`);

    try {
        const headers = {
            'Content-Type': 'application/json'
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(url, { headers });
        const result = await response.json();

        if (result.status) {
            console.log('✅ Success!');
            console.log(JSON.stringify(result.data, null, 2));
            return result.data;
        } else {
            console.log('❌ Error:', result.message);
            return null;
        }
    } catch (error) {
        console.error('❌ Request failed:', error.message);
        return null;
    }
}

/**
 * Display sample data formats
 */
function displaySampleFormats() {
    console.log('\n' + '='.repeat(80));
    console.log('📈 SALES REPORTS CHARTS API - SAMPLE DATA FORMATS');
    console.log('='.repeat(80));

    console.log('\n1️⃣  MONTHLY DATA FORMAT:');
    console.log(JSON.stringify(sampleMonthlyData, null, 2));

    console.log('\n2️⃣  WEEKLY DATA FORMAT:');
    console.log(JSON.stringify(sampleWeeklyData, null, 2));

    console.log('\n3️⃣  QUARTERLY DATA FORMAT:');
    console.log(JSON.stringify(sampleQuarterlyData, null, 2));

    console.log('\n4️⃣  YEARLY DATA FORMAT:');
    console.log(JSON.stringify(sampleYearlyData, null, 2));

    console.log('\n' + '='.repeat(80));
}

/**
 * Example usage patterns
 */
function displayUsageExamples() {
    console.log('\n' + '='.repeat(80));
    console.log('💡 USAGE EXAMPLES');
    console.log('='.repeat(80));

    console.log('\n📅 Monthly data for 2025:');
    console.log('GET /api/sales/reports/charts?period=monthly&year=2025');

    console.log('\n📅 Weekly data for December 2025:');
    console.log('GET /api/sales/reports/charts?period=weekly&year=2025&month=12');

    console.log('\n📅 Quarterly data for 2025:');
    console.log('GET /api/sales/reports/charts?period=quarterly&year=2025');

    console.log('\n📅 Yearly data (last 5 years):');
    console.log('GET /api/sales/reports/charts?period=yearly&year=2025');

    console.log('\n📅 Default (monthly data for current year):');
    console.log('GET /api/sales/reports/charts');

    console.log('\n' + '='.repeat(80));
}

/**
 * Chart.js integration example
 */
function displayChartJsExample() {
    console.log('\n' + '='.repeat(80));
    console.log('📊 CHART.JS INTEGRATION EXAMPLE');
    console.log('='.repeat(80));

    const example = `
// React component example
import { Line } from 'react-chartjs-2';
import { useState, useEffect } from 'react';

const SalesChart = ({ period = 'monthly', year = 2025 }) => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      const params = new URLSearchParams({ period, year });
      
      const response = await fetch(
        \`/api/sales/reports/charts?\${params}\`,
        {
          headers: {
            'Authorization': \`Bearer \${token}\`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      const result = await response.json();
      
      if (result.status) {
        const data = result.data.data;
        setChartData({
          labels: data.map(d => d.date),
          datasets: [
            {
              label: 'Revenue ($)',
              data: data.map(d => d.amount),
              borderColor: 'rgb(75, 192, 192)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              tension: 0.4
            }
          ]
        });
      }
      setLoading(false);
    };
    
    fetchData();
  }, [period, year]);
  
  if (loading) return <div>Loading chart...</div>;
  if (!chartData) return <div>No data available</div>;
  
  return (
    <div>
      <h2>Sales Revenue - {period.charAt(0).toUpperCase() + period.slice(1)}</h2>
      <Line 
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            legend: { position: 'top' },
            title: {
              display: true,
              text: \`Sales Revenue (\${year})\`
            }
          }
        }}
      />
    </div>
  );
};

export default SalesChart;
`;

    console.log(example);
    console.log('='.repeat(80));
}

// Main execution
if (require.main === module) {
    displaySampleFormats();
    displayUsageExamples();
    displayChartJsExample();

    console.log('\n✨ To test the API, make sure your server is running and you have a valid JWT token.');
    console.log('📝 See SALES_REPORTS_CHARTS_API.md for complete documentation.\n');
}

// Export for use in other scripts
module.exports = {
    fetchChartData,
    sampleMonthlyData,
    sampleWeeklyData,
    sampleQuarterlyData,
    sampleYearlyData
};
