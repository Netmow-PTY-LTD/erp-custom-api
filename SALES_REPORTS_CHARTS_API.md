# Sales Reports Charts API

## Overview
This document describes the Sales Reports Charts API endpoint that provides aggregated sales data for visualization in different time periods.

## Endpoint

**GET** `/api/sales/reports/charts`

## Description
Get sales chart data aggregated by different time periods (monthly, weekly, quarterly, yearly). The endpoint aggregates order data from the `orders` table and returns revenue amounts and order counts grouped by the specified time period.

## Authentication
- Requires valid JWT token in the Authorization header
- Requires 'sales' module access

## Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `period` | string | No | `monthly` | Time period for aggregation: `monthly`, `weekly`, `quarterly`, `yearly` |
| `year` | integer | No | Current year | Year for data retrieval |
| `month` | integer | No | Current month | Month for weekly data (1-12, only used when period=weekly) |
| `quarter` | integer | No | null | Quarter for quarterly data (1-4, reserved for future use) |

## Response Format

```json
{
  "status": true,
  "message": "Chart data retrieved successfully",
  "data": {
    "period": "monthly",
    "year": 2025,
    "month": null,
    "quarter": null,
    "data": [
      {
        "date": "2025-01",
        "amount": 15000,
        "order_count": 45
      },
      {
        "date": "2025-02",
        "amount": 18000,
        "order_count": 52
      }
    ]
  }
}
```

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `period` | string | The time period used for aggregation |
| `year` | integer | The year for which data was retrieved |
| `month` | integer/null | The month used (for weekly period) |
| `quarter` | integer/null | The quarter used (reserved) |
| `data` | array | Array of data points |
| `data[].date` | string | Date identifier (format varies by period) |
| `data[].amount` | number | Total revenue for the period |
| `data[].order_count` | integer | Number of orders in the period |

## Date Format by Period

### Monthly
- **Format**: `YYYY-MM`
- **Example**: `2025-01`, `2025-02`, `2025-12`
- **Returns**: 12 data points (one per month) for the specified year

### Weekly
- **Format**: `YYYY-WWW` (ISO week number)
- **Example**: `2025-W48`, `2025-W49`, `2025-W50`
- **Returns**: 4-5 data points (weeks in the specified month)

### Quarterly
- **Format**: `QN` (where N is 1-4)
- **Example**: `Q1`, `Q2`, `Q3`, `Q4`
- **Returns**: 4 data points (one per quarter) for the specified year

### Yearly
- **Format**: `YYYY`
- **Example**: `2021`, `2022`, `2023`, `2024`, `2025`
- **Returns**: 5 data points (last 5 years including the specified year)

## Usage Examples

### 1. Monthly Data for 2025

**Request:**
```
GET /api/sales/reports/charts?period=monthly&year=2025
```

**Response:**
```json
{
  "status": true,
  "message": "Chart data retrieved successfully",
  "data": {
    "period": "monthly",
    "year": 2025,
    "month": null,
    "quarter": null,
    "data": [
      { "date": "2025-01", "amount": 15000, "order_count": 45 },
      { "date": "2025-02", "amount": 18000, "order_count": 52 },
      { "date": "2025-03", "amount": 16500, "order_count": 48 },
      { "date": "2025-04", "amount": 19200, "order_count": 55 },
      { "date": "2025-05", "amount": 21000, "order_count": 60 },
      { "date": "2025-06", "amount": 20500, "order_count": 58 },
      { "date": "2025-07", "amount": 22000, "order_count": 62 },
      { "date": "2025-08", "amount": 23500, "order_count": 65 },
      { "date": "2025-09", "amount": 21800, "order_count": 61 },
      { "date": "2025-10", "amount": 24000, "order_count": 68 },
      { "date": "2025-11", "amount": 25500, "order_count": 72 },
      { "date": "2025-12", "amount": 27000, "order_count": 75 }
    ]
  }
}
```

### 2. Weekly Data for December 2025

**Request:**
```
GET /api/sales/reports/charts?period=weekly&year=2025&month=12
```

**Response:**
```json
{
  "status": true,
  "message": "Chart data retrieved successfully",
  "data": {
    "period": "weekly",
    "year": 2025,
    "month": 12,
    "quarter": null,
    "data": [
      { "date": "2025-W48", "amount": 5000, "order_count": 15 },
      { "date": "2025-W49", "amount": 6000, "order_count": 18 },
      { "date": "2025-W50", "amount": 7000, "order_count": 20 },
      { "date": "2025-W51", "amount": 6500, "order_count": 19 },
      { "date": "2025-W52", "amount": 2500, "order_count": 8 }
    ]
  }
}
```

### 3. Quarterly Data for 2025

**Request:**
```
GET /api/sales/reports/charts?period=quarterly&year=2025
```

**Response:**
```json
{
  "status": true,
  "message": "Chart data retrieved successfully",
  "data": {
    "period": "quarterly",
    "year": 2025,
    "month": null,
    "quarter": null,
    "data": [
      { "date": "Q1", "amount": 49500, "order_count": 145 },
      { "date": "Q2", "amount": 60700, "order_count": 173 },
      { "date": "Q3", "amount": 67300, "order_count": 188 },
      { "date": "Q4", "amount": 76500, "order_count": 215 }
    ]
  }
}
```

### 4. Yearly Data (Last 5 Years)

**Request:**
```
GET /api/sales/reports/charts?period=yearly&year=2025
```

**Response:**
```json
{
  "status": true,
  "message": "Chart data retrieved successfully",
  "data": {
    "period": "yearly",
    "year": 2025,
    "month": null,
    "quarter": null,
    "data": [
      { "date": "2021", "amount": 180000, "order_count": 520 },
      { "date": "2022", "amount": 210000, "order_count": 605 },
      { "date": "2023", "amount": 245000, "order_count": 698 },
      { "date": "2024", "amount": 280000, "order_count": 795 },
      { "date": "2025", "amount": 320000, "order_count": 900 }
    ]
  }
}
```

### 5. Default Request (Current Year, Monthly)

**Request:**
```
GET /api/sales/reports/charts
```

**Response:**
Returns monthly data for the current year (2025).

## Frontend Integration Example

### JavaScript/React Example

```javascript
const fetchChartData = async (period = 'monthly', year = 2025, month = null) => {
  try {
    const params = new URLSearchParams({ period, year });
    if (month) params.append('month', month);
    
    const response = await fetch(`/api/sales/reports/charts?${params}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const result = await response.json();
    
    if (result.status) {
      // Transform data for chart library (e.g., Chart.js, Recharts)
      const chartData = result.data.data.map(item => ({
        date: item.date,
        amount: item.amount,
        orderCount: item.order_count
      }));
      
      return chartData;
    }
  } catch (error) {
    console.error('Error fetching chart data:', error);
  }
};

// Usage examples
const monthlyData = await fetchChartData('monthly', 2025);
const weeklyData = await fetchChartData('weekly', 2025, 12);
const quarterlyData = await fetchChartData('quarterly', 2025);
const yearlyData = await fetchChartData('yearly', 2025);
```

### Chart.js Integration

```javascript
import { Line } from 'react-chartjs-2';

const RevenueChart = ({ period = 'monthly' }) => {
  const [chartData, setChartData] = useState(null);
  
  useEffect(() => {
    fetchChartData(period, 2025).then(data => {
      setChartData({
        labels: data.map(d => d.date),
        datasets: [
          {
            label: 'Revenue',
            data: data.map(d => d.amount),
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
          },
          {
            label: 'Order Count',
            data: data.map(d => d.orderCount),
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            yAxisID: 'y1',
          }
        ]
      });
    });
  }, [period]);
  
  if (!chartData) return <div>Loading...</div>;
  
  return <Line data={chartData} />;
};
```

## Database Schema

The endpoint queries the `orders` table with the following relevant fields:

- `id` - Order ID
- `order_date` - Date when the order was placed
- `total_amount` - Total amount of the order

## Implementation Details

### Controller
- **File**: `src/modules/sales/sales.controller.js`
- **Method**: `getReportsCharts(req, res)`

### Service
- **File**: `src/modules/sales/sales.service.js`
- **Method**: `getReportsCharts(period, year, month, quarter)`

### Repository
- **File**: `src/modules/sales/sales.repository.js`
- **Class**: `OrderRepository`

## Error Handling

The API returns standard error responses:

```json
{
  "status": false,
  "message": "Error message here"
}
```

Common error scenarios:
- Invalid period parameter
- Database connection errors
- Authentication/authorization failures

## Performance Considerations

- The endpoint uses SQL aggregation functions for efficient data processing
- Results are grouped at the database level to minimize data transfer
- No pagination is needed as the result sets are small (max 12 months, 52 weeks, 4 quarters, or 5 years)

## Notes

- All amounts are in the currency configured in your system
- The `order_count` includes all orders regardless of status
- Data is aggregated based on `order_date`, not completion date
- Weekly data uses ISO week numbers
- Quarterly data divides the year into Q1 (Jan-Mar), Q2 (Apr-Jun), Q3 (Jul-Sep), Q4 (Oct-Dec)
- Yearly data always returns the last 5 years including the specified year

## Future Enhancements

Potential improvements for future versions:
- Add filtering by order status
- Add filtering by customer or product
- Support for custom date ranges
- Export functionality (CSV, PDF)
- Comparison with previous periods
- Revenue vs. profit analysis
- Customer segmentation in charts
