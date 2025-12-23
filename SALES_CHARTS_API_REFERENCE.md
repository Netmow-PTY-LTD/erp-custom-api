# Sales Charts API - Quick Reference

## Endpoint
```
GET /api/sales/reports/charts
```

## ✅ Required Parameters
Both parameters are **REQUIRED**:
- `start_date` (YYYY-MM-DD format) - Start date for the chart data
- `end_date` (YYYY-MM-DD format) - End date for the chart data

## ❌ Common Error
```json
{
  "status": false,
  "message": "start_date and end_date are required"
}
```
**Cause:** Missing one or both date parameters
**Solution:** Always provide both `start_date` and `end_date`

## ✅ Correct Usage Examples

### 1. Get Daily Data for January 2025
```bash
GET /api/sales/reports/charts?start_date=2025-01-01&end_date=2025-01-31
```

### 2. Get Data for Last 7 Days
```bash
GET /api/sales/reports/charts?start_date=2025-12-16&end_date=2025-12-23
```

### 3. Get Data for Entire Year 2025
```bash
GET /api/sales/reports/charts?start_date=2025-01-01&end_date=2025-12-31
```

### 4. Get Data for December 2025
```bash
GET /api/sales/reports/charts?start_date=2025-12-01&end_date=2025-12-31
```

### 5. Get Data for a Specific Week
```bash
GET /api/sales/reports/charts?start_date=2025-12-01&end_date=2025-12-07
```

## Response Structure

```json
{
  "status": true,
  "message": "Chart data retrieved successfully",
  "data": {
    "start_date": "2025-01-01",
    "end_date": "2025-01-31",
    "data": [
      {
        "date": "2025-01-01",
        "amount": 5000,
        "order_count": 15
      },
      {
        "date": "2025-01-02",
        "amount": 6000,
        "order_count": 18
      },
      {
        "date": "2025-01-03",
        "amount": 4500,
        "order_count": 13
      }
      // ... more daily data
    ]
  }
}
```

## Response Fields

- `start_date` - The start date you provided
- `end_date` - The end date you provided
- `data` - Array of daily sales data
  - `date` - Date in YYYY-MM-DD format
  - `amount` - Total sales amount for that day
  - `order_count` - Number of orders for that day

## cURL Examples

### Basic Request
```bash
curl -X GET "http://localhost:3000/api/sales/reports/charts?start_date=2025-01-01&end_date=2025-01-31" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### With Pretty Print (using jq)
```bash
curl -X GET "http://localhost:3000/api/sales/reports/charts?start_date=2025-01-01&end_date=2025-01-31" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" | jq
```

## JavaScript/Axios Example

```javascript
const axios = require('axios');

async function getSalesCharts(startDate, endDate) {
  try {
    const response = await axios.get('http://localhost:3000/api/sales/reports/charts', {
      params: {
        start_date: startDate,
        end_date: endDate
      },
      headers: {
        'Authorization': `Bearer ${YOUR_TOKEN}`
      }
    });
    
    console.log('Chart Data:', response.data.data);
    
    // Process chart data
    response.data.data.data.forEach(day => {
      console.log(`${day.date}: $${day.amount} (${day.order_count} orders)`);
    });
    
    return response.data;
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

// Usage
getSalesCharts('2025-01-01', '2025-01-31');
```

## Postman Example

**Method:** GET
**URL:** `http://localhost:3000/api/sales/reports/charts`

**Query Params:**
| Key | Value | Required |
|-----|-------|----------|
| start_date | 2025-01-01 | ✅ Yes |
| end_date | 2025-01-31 | ✅ Yes |

**Headers:**
| Key | Value |
|-----|-------|
| Authorization | Bearer YOUR_TOKEN_HERE |

## Common Use Cases

### 1. Last 7 Days Chart
```bash
GET /api/sales/reports/charts?start_date=2025-12-16&end_date=2025-12-23
```

### 2. Last 30 Days Chart
```bash
GET /api/sales/reports/charts?start_date=2025-11-23&end_date=2025-12-23
```

### 3. Monthly Chart (January 2025)
```bash
GET /api/sales/reports/charts?start_date=2025-01-01&end_date=2025-01-31
```

### 4. Quarterly Chart (Q1 2025)
```bash
GET /api/sales/reports/charts?start_date=2025-01-01&end_date=2025-03-31
```

### 5. Yearly Chart (2025)
```bash
GET /api/sales/reports/charts?start_date=2025-01-01&end_date=2025-12-31
```

### 6. Custom Range (Black Friday Weekend)
```bash
GET /api/sales/reports/charts?start_date=2025-11-28&end_date=2025-12-01
```

## Date Format

✅ **Correct Format:** YYYY-MM-DD
- `2025-01-01`
- `2025-12-31`

❌ **Incorrect Formats:**
- `01-01-2025` (MM-DD-YYYY)
- `2025/01/01` (Using slashes)
- `Jan 1, 2025` (Text format)

## Error Handling

### Missing Parameters
**Request:**
```bash
GET /api/sales/reports/charts
```

**Response:**
```json
{
  "status": false,
  "message": "start_date and end_date are required"
}
```
**HTTP Status:** 400

### Missing start_date Only
**Request:**
```bash
GET /api/sales/reports/charts?end_date=2025-12-31
```

**Response:**
```json
{
  "status": false,
  "message": "start_date and end_date are required"
}
```
**HTTP Status:** 400

### Missing end_date Only
**Request:**
```bash
GET /api/sales/reports/charts?start_date=2025-01-01
```

**Response:**
```json
{
  "status": false,
  "message": "start_date and end_date are required"
}
```
**HTTP Status:** 400

## Frontend Integration Example

### React Example
```javascript
import { useState, useEffect } from 'react';
import axios from 'axios';

function SalesChart() {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const fetchChartData = async (startDate, endDate) => {
    setLoading(true);
    try {
      const response = await axios.get('/api/sales/reports/charts', {
        params: {
          start_date: startDate,
          end_date: endDate
        }
      });
      setChartData(response.data.data.data);
    } catch (error) {
      console.error('Error fetching chart data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    // Fetch last 30 days on mount
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      .toISOString().split('T')[0];
    
    fetchChartData(startDate, endDate);
  }, []);
  
  return (
    <div>
      {loading ? 'Loading...' : (
        <ul>
          {chartData.map(day => (
            <li key={day.date}>
              {day.date}: ${day.amount} ({day.order_count} orders)
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

### Chart.js Integration
```javascript
import { Chart } from 'chart.js';

async function renderSalesChart(startDate, endDate) {
  const response = await axios.get('/api/sales/reports/charts', {
    params: { start_date: startDate, end_date: endDate }
  });
  
  const chartData = response.data.data.data;
  
  new Chart(document.getElementById('salesChart'), {
    type: 'line',
    data: {
      labels: chartData.map(d => d.date),
      datasets: [{
        label: 'Sales Amount',
        data: chartData.map(d => d.amount),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }, {
        label: 'Order Count',
        data: chartData.map(d => d.order_count),
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1
      }]
    }
  });
}

// Usage
renderSalesChart('2025-01-01', '2025-01-31');
```

## Testing

### Quick Test (Copy & Paste)
```bash
# Replace YOUR_TOKEN with your actual token
curl -X GET "http://localhost:3000/api/sales/reports/charts?start_date=2025-01-01&end_date=2025-01-31" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Test Script
Test file is available at:
`/Applications/MAMP/htdocs/backened-erp-minimal/test-sales-datewise-api.js`

To run:
```bash
node test-sales-datewise-api.js
```

## Important Notes

- ✅ Both `start_date` and `end_date` are **REQUIRED**
- ✅ Date range is **inclusive** (includes both start and end dates)
- ✅ Returns **daily** aggregated data
- ✅ Data is grouped by `DATE(order_date)`
- ✅ Empty days (no orders) are **not included** in the response
- ✅ Results are ordered by date (ascending)

## Related Endpoints

- **Sales Summary:** `GET /api/reports/sales/summary?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD`
- **All Orders:** `GET /api/sales/orders`
- **All Invoices:** `GET /api/sales/orders/invoices`

## Quick Reference Card

```
┌─────────────────────────────────────────────────────────┐
│ GET /api/sales/reports/charts                           │
├─────────────────────────────────────────────────────────┤
│ Required Parameters:                                    │
│   • start_date (YYYY-MM-DD)                            │
│   • end_date (YYYY-MM-DD)                              │
├─────────────────────────────────────────────────────────┤
│ Example:                                                │
│   ?start_date=2025-01-01&end_date=2025-01-31          │
├─────────────────────────────────────────────────────────┤
│ Returns:                                                │
│   • Daily sales data                                    │
│   • Date, amount, order_count for each day            │
└─────────────────────────────────────────────────────────┘
```

## Support

For more details, see:
- Full Documentation: `/Applications/MAMP/htdocs/backened-erp-minimal/SALES_DATEWISE_FILTER_IMPLEMENTATION.md`
- Route Definition: `/src/modules/sales/sales.routes.js`
- Service Implementation: `/src/modules/sales/sales.service.js`
