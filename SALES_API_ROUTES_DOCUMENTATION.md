# Sales API Routes Documentation

## Overview
This document provides comprehensive documentation for all Sales module API endpoints with datewise filters.

---

## 1. Sales Summary Report

### Endpoint
```
GET /api/reports/sales/summary
```

### Description
Get comprehensive sales summary statistics with datewise filter. Returns aggregated data including total orders, sales, taxes, discounts, and breakdowns by status and payment status.

### Authentication
Required: Yes (Bearer Token)

### Module
Sales & Orders

### Query Parameters

| Parameter | Type | Required | Format | Description |
|-----------|------|----------|--------|-------------|
| `start_date` | string | ✅ Yes | YYYY-MM-DD | Start date for filtering orders |
| `end_date` | string | ✅ Yes | YYYY-MM-DD | End date for filtering orders |

### Database Tables Used
- **Main Table:** `orders`
- **Fields Used:**
  - `id` - Order identifier
  - `order_date` - Date of order (used for filtering)
  - `total_amount` - Total order amount
  - `tax_amount` - Tax amount
  - `discount_amount` - Discount amount
  - `status` - Order status
  - `payment_status` - Payment status

### Calculated Fields
- `total_orders` - COUNT of all orders
- `total_sales` - SUM of total_amount
- `average_order_value` - AVG of total_amount
- `total_tax` - SUM of tax_amount
- `total_discount` - SUM of discount_amount

### Response Structure

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

### Examples

#### Example 1: Get sales summary for entire year 2025
```http
GET /api/reports/sales/summary?start_date=2025-01-01&end_date=2025-12-31
Authorization: Bearer YOUR_TOKEN
```

#### Example 2: Get sales summary for December 2025
```http
GET /api/reports/sales/summary?start_date=2025-12-01&end_date=2025-12-31
Authorization: Bearer YOUR_TOKEN
```

#### Example 3: Get sales summary for Q1 2025
```http
GET /api/reports/sales/summary?start_date=2025-01-01&end_date=2025-03-31
Authorization: Bearer YOUR_TOKEN
```

#### Example 4: Get sales summary for last 7 days
```http
GET /api/reports/sales/summary?start_date=2025-12-16&end_date=2025-12-23
Authorization: Bearer YOUR_TOKEN
```

### Error Responses

#### Missing Parameters (400)
```json
{
  "status": false,
  "message": "start_date and end_date are required"
}
```

#### Server Error (500)
```json
{
  "status": false,
  "message": "Error message details"
}
```

### Implementation Details

**Controller:** `SalesController.getSalesSummary()`
**Service:** `SalesService.getSalesSummary(start_date, end_date)`
**Repository:** `OrderRepository.model.findAll()` with aggregations

**SQL Query Pattern:**
```sql
-- Summary statistics
SELECT 
  COUNT(id) as total_orders,
  SUM(total_amount) as total_sales,
  AVG(total_amount) as average_order_value,
  SUM(tax_amount) as total_tax,
  SUM(discount_amount) as total_discount
FROM orders
WHERE order_date BETWEEN ? AND ?;

-- Status breakdown
SELECT 
  status,
  COUNT(id) as count,
  SUM(total_amount) as amount
FROM orders
WHERE order_date BETWEEN ? AND ?
GROUP BY status;

-- Payment status breakdown
SELECT 
  payment_status,
  COUNT(id) as count,
  SUM(total_amount) as amount
FROM orders
WHERE order_date BETWEEN ? AND ?
GROUP BY payment_status;
```

---

## 2. Sales Charts Data

### Endpoint
```
GET /api/sales/reports/charts
```

### Description
Get daily sales chart data with datewise filter. Returns aggregated sales amount and order count for each day in the specified date range.

### Authentication
Required: Yes (Bearer Token)

### Module
Sales & Orders

### Query Parameters

| Parameter | Type | Required | Format | Description |
|-----------|------|----------|--------|-------------|
| `start_date` | string | ✅ Yes | YYYY-MM-DD | Start date for filtering orders |
| `end_date` | string | ✅ Yes | YYYY-MM-DD | End date for filtering orders |

### Database Tables Used
- **Main Table:** `orders`
- **Fields Used:**
  - `id` - Order identifier
  - `order_date` - Date of order (used for filtering and grouping)
  - `total_amount` - Total order amount

### Calculated Fields
- `date` - DATE(order_date) - Grouped by date
- `amount` - SUM of total_amount per day
- `order_count` - COUNT of orders per day

### Response Structure

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
    ]
  }
}
```

### Examples

#### Example 1: Get daily data for January 2025
```http
GET /api/sales/reports/charts?start_date=2025-01-01&end_date=2025-01-31
Authorization: Bearer YOUR_TOKEN
```

#### Example 2: Get data for a specific week
```http
GET /api/sales/reports/charts?start_date=2025-12-01&end_date=2025-12-07
Authorization: Bearer YOUR_TOKEN
```

#### Example 3: Get data for entire year
```http
GET /api/sales/reports/charts?start_date=2025-01-01&end_date=2025-12-31
Authorization: Bearer YOUR_TOKEN
```

### Error Responses

#### Missing Parameters (400)
```json
{
  "status": false,
  "message": "start_date and end_date are required"
}
```

#### Server Error (500)
```json
{
  "status": false,
  "message": "Error message details"
}
```

### Implementation Details

**Controller:** `SalesController.getReportsCharts()`
**Service:** `SalesService.getReportsCharts(start_date, end_date)`
**Repository:** `OrderRepository.model.findAll()` with date grouping

**SQL Query Pattern:**
```sql
SELECT 
  DATE(order_date) as date,
  SUM(total_amount) as amount,
  COUNT(id) as order_count
FROM orders
WHERE order_date BETWEEN ? AND ?
GROUP BY DATE(order_date)
ORDER BY DATE(order_date) ASC;
```

---

## Route Metadata Summary

### Sales Summary Route
```javascript
{
  path: '/reports/sales/summary',
  method: 'GET',
  middlewares: [],
  handler: (req, res) => salesController.getSalesSummary(req, res),
  description: 'Get sales summary with datewise filter',
  database: {
    tables: ['orders'],
    mainTable: 'orders',
    fields: {
      orders: ['id', 'order_date', 'total_amount', 'tax_amount', 'discount_amount', 'status', 'payment_status'],
      calculated: ['total_orders', 'total_sales', 'average_order_value', 'total_tax', 'total_discount']
    }
  },
  queryParams: {
    start_date: 'Start date for filtering (YYYY-MM-DD) - Required',
    end_date: 'End date for filtering (YYYY-MM-DD) - Required'
  }
}
```

### Sales Charts Route
```javascript
{
  path: '/reports/charts',
  method: 'GET',
  middlewares: [],
  handler: (req, res) => salesController.getReportsCharts(req, res),
  description: 'Get sales chart data with datewise filter',
  database: {
    tables: ['orders'],
    mainTable: 'orders',
    fields: {
      orders: ['id', 'order_date', 'total_amount'],
      calculated: ['date', 'amount', 'order_count']
    }
  },
  queryParams: {
    start_date: 'Start date for filtering (YYYY-MM-DD) - Required',
    end_date: 'End date for filtering (YYYY-MM-DD) - Required'
  }
}
```

---

## Common Use Cases

### 1. Dashboard Overview (Last 30 Days)
```javascript
// Summary
GET /api/reports/sales/summary?start_date=2025-11-23&end_date=2025-12-23

// Chart
GET /api/sales/reports/charts?start_date=2025-11-23&end_date=2025-12-23
```

### 2. Monthly Report
```javascript
// January 2025
GET /api/reports/sales/summary?start_date=2025-01-01&end_date=2025-01-31
GET /api/sales/reports/charts?start_date=2025-01-01&end_date=2025-01-31
```

### 3. Quarterly Report
```javascript
// Q1 2025
GET /api/reports/sales/summary?start_date=2025-01-01&end_date=2025-03-31
GET /api/sales/reports/charts?start_date=2025-01-01&end_date=2025-03-31
```

### 4. Yearly Report
```javascript
// 2025
GET /api/reports/sales/summary?start_date=2025-01-01&end_date=2025-12-31
GET /api/sales/reports/charts?start_date=2025-01-01&end_date=2025-12-31
```

### 5. Custom Date Range
```javascript
// Black Friday to Cyber Monday
GET /api/reports/sales/summary?start_date=2025-11-28&end_date=2025-12-01
GET /api/sales/reports/charts?start_date=2025-11-28&end_date=2025-12-01
```

---

## Testing

### Using cURL

```bash
# Sales Summary
curl -X GET "http://localhost:3000/api/reports/sales/summary?start_date=2025-01-01&end_date=2025-12-31" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Sales Charts
curl -X GET "http://localhost:3000/api/sales/reports/charts?start_date=2025-01-01&end_date=2025-12-31" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Using Test Script

```bash
node test-sales-datewise-api.js
```

---

## File References

- **Routes Definition:** `/src/modules/sales/sales.routes.js`
- **Controller:** `/src/modules/sales/sales.controller.js`
- **Service:** `/src/modules/sales/sales.service.js`
- **Repository:** `/src/modules/sales/sales.repository.js`
- **Test Script:** `/test-sales-datewise-api.js`

---

## Migration Notes

### Breaking Changes from Previous Version

**Old API (Removed):**
```
GET /api/sales/reports/charts?period=monthly&year=2025
GET /api/sales/reports/charts?period=weekly&year=2025&month=12
GET /api/sales/reports/charts?period=quarterly&year=2025
GET /api/sales/reports/charts?period=yearly&year=2025
```

**New API (Current):**
```
GET /api/sales/reports/charts?start_date=2025-01-01&end_date=2025-12-31
```

### Migration Guide

**Monthly → Datewise:**
```javascript
// Old
?period=monthly&year=2025

// New
?start_date=2025-01-01&end_date=2025-12-31
```

**Weekly → Datewise:**
```javascript
// Old
?period=weekly&year=2025&month=12

// New (first week of December)
?start_date=2025-12-01&end_date=2025-12-07
```

**Quarterly → Datewise:**
```javascript
// Old
?period=quarterly&year=2025

// New (Q1)
?start_date=2025-01-01&end_date=2025-03-31
```

**Yearly → Datewise:**
```javascript
// Old
?period=yearly&year=2025

// New
?start_date=2025-01-01&end_date=2025-12-31
```

---

## Performance Considerations

- Date range filtering uses indexed `order_date` column
- Aggregation queries are optimized with GROUP BY
- Results are ordered by date for efficient rendering
- Consider adding pagination for very large date ranges
- Empty days (no orders) are not included in results

---

## Security

- ✅ Authentication required (Bearer Token)
- ✅ Module access check (sales module)
- ✅ Input validation for date parameters
- ✅ SQL injection prevention (parameterized queries)
- ✅ No sensitive data exposure

---

## Support

For questions or issues:
1. Check this documentation
2. Review test scripts
3. Check service implementation
4. Review route metadata in `sales.routes.js`
