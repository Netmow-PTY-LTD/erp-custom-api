# Sales Summary API - Quick Reference

## Endpoint
```
GET /api/reports/sales/summary
```

## Required Parameters
- `start_date` (YYYY-MM-DD format) - Start date for the report
- `end_date` (YYYY-MM-DD format) - End date for the report

## Example Requests

### 1. Get Summary for Entire Year 2025
```bash
GET /api/reports/sales/summary?start_date=2025-01-01&end_date=2025-12-31
```

### 2. Get Summary for December 2025
```bash
GET /api/reports/sales/summary?start_date=2025-12-01&end_date=2025-12-31
```

### 3. Get Summary for Last 7 Days
```bash
GET /api/reports/sales/summary?start_date=2025-12-16&end_date=2025-12-23
```

### 4. Get Summary for Specific Month (January 2025)
```bash
GET /api/reports/sales/summary?start_date=2025-01-01&end_date=2025-01-31
```

### 5. Get Summary for a Quarter (Q1 2025)
```bash
GET /api/reports/sales/summary?start_date=2025-01-01&end_date=2025-03-31
```

## Response Structure

```json
{
  "status": true,
  "message": "Sales summary retrieved successfully",
  "data": {
    "start_date": "2025-01-01",
    "end_date": "2025-12-31",
    "summary": {
      "total_orders": 150,
      "total_sales": 320000,
      "average_order_value": 2133.33,
      "total_tax": 25600,
      "total_discount": 15000
    },
    "status_breakdown": [
      {
        "status": "pending",
        "count": 30,
        "amount": 64000
      },
      {
        "status": "confirmed",
        "count": 50,
        "amount": 106666.67
      },
      {
        "status": "delivered",
        "count": 70,
        "amount": 149333.33
      }
    ],
    "payment_status_breakdown": [
      {
        "payment_status": "paid",
        "count": 100,
        "amount": 213333.33
      },
      {
        "payment_status": "pending",
        "count": 50,
        "amount": 106666.67
      }
    ]
  }
}
```

## Response Fields Explained

### Summary Object
- `total_orders` - Total number of orders in the date range
- `total_sales` - Sum of all order amounts
- `average_order_value` - Average amount per order
- `total_tax` - Sum of all tax amounts
- `total_discount` - Sum of all discounts applied

### Status Breakdown
Shows order count and amount grouped by order status:
- `pending` - Orders awaiting processing
- `confirmed` - Orders that have been confirmed
- `delivered` - Orders that have been delivered
- `shipped` - Orders in transit
- `cancelled` - Cancelled orders

### Payment Status Breakdown
Shows order count and amount grouped by payment status:
- `paid` - Fully paid orders
- `pending` - Orders with pending payment
- `partial` - Partially paid orders

## Error Responses

### Missing Parameters
```json
{
  "status": false,
  "message": "start_date and end_date are required"
}
```
**HTTP Status:** 400

### Invalid Date Format
```json
{
  "status": false,
  "message": "Invalid date format"
}
```
**HTTP Status:** 500

## cURL Examples

### Basic Request
```bash
curl -X GET "http://localhost:3000/api/reports/sales/summary?start_date=2025-01-01&end_date=2025-12-31" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### With Pretty Print
```bash
curl -X GET "http://localhost:3000/api/reports/sales/summary?start_date=2025-01-01&end_date=2025-12-31" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" | jq
```

## JavaScript/Axios Example

```javascript
const axios = require('axios');

async function getSalesSummary(startDate, endDate) {
  try {
    const response = await axios.get('http://localhost:3000/api/reports/sales/summary', {
      params: {
        start_date: startDate,
        end_date: endDate
      },
      headers: {
        'Authorization': `Bearer ${YOUR_TOKEN}`
      }
    });
    
    console.log('Summary:', response.data.data.summary);
    console.log('Status Breakdown:', response.data.data.status_breakdown);
    console.log('Payment Breakdown:', response.data.data.payment_status_breakdown);
    
    return response.data;
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

// Usage
getSalesSummary('2025-01-01', '2025-12-31');
```

## Postman Example

**Method:** GET
**URL:** `http://localhost:3000/api/reports/sales/summary`

**Query Params:**
| Key | Value |
|-----|-------|
| start_date | 2025-01-01 |
| end_date | 2025-12-31 |

**Headers:**
| Key | Value |
|-----|-------|
| Authorization | Bearer YOUR_TOKEN_HERE |

## Date Format Rules

✅ **Valid Formats:**
- `2025-01-01` (YYYY-MM-DD)
- `2025-12-31` (YYYY-MM-DD)

❌ **Invalid Formats:**
- `01-01-2025` (MM-DD-YYYY)
- `2025/01/01` (Using slashes)
- `Jan 1, 2025` (Text format)

## Common Use Cases

### 1. Monthly Report
```bash
# January 2025
GET /api/reports/sales/summary?start_date=2025-01-01&end_date=2025-01-31
```

### 2. Quarterly Report
```bash
# Q1 2025 (Jan-Mar)
GET /api/reports/sales/summary?start_date=2025-01-01&end_date=2025-03-31

# Q2 2025 (Apr-Jun)
GET /api/reports/sales/summary?start_date=2025-04-01&end_date=2025-06-30

# Q3 2025 (Jul-Sep)
GET /api/reports/sales/summary?start_date=2025-07-01&end_date=2025-09-30

# Q4 2025 (Oct-Dec)
GET /api/reports/sales/summary?start_date=2025-10-01&end_date=2025-12-31
```

### 3. Yearly Report
```bash
# Full year 2025
GET /api/reports/sales/summary?start_date=2025-01-01&end_date=2025-12-31
```

### 4. Custom Date Range
```bash
# Black Friday to Cyber Monday
GET /api/reports/sales/summary?start_date=2025-11-28&end_date=2025-12-01
```

### 5. Year-to-Date (YTD)
```bash
# From Jan 1 to today (Dec 23)
GET /api/reports/sales/summary?start_date=2025-01-01&end_date=2025-12-23
```

## Testing

Test file is available at:
`/Applications/MAMP/htdocs/backened-erp-minimal/test-sales-datewise-api.js`

To run tests:
```bash
node test-sales-datewise-api.js
```

## Related Endpoints

- **Sales Charts:** `GET /api/sales/reports/charts?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD`
- **All Orders:** `GET /api/sales/orders`
- **All Invoices:** `GET /api/sales/orders/invoices`

## Notes

- Both `start_date` and `end_date` are **required**
- Date range is **inclusive** (includes both start and end dates)
- The API filters based on the `order_date` field in the orders table
- All amounts are returned as numbers (not strings)
- Counts are returned as integers

## Support

For more details, see:
- Full Documentation: `/Applications/MAMP/htdocs/backened-erp-minimal/SALES_DATEWISE_FILTER_IMPLEMENTATION.md`
- Route Definition: `/src/modules/sales/sales.routes.js`
- Service Implementation: `/src/modules/sales/sales.service.js`
