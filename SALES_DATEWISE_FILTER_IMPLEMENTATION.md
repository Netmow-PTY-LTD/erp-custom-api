# Sales API Datewise Filter Implementation

## Summary of Changes

This document outlines the changes made to implement datewise filters for the sales reporting APIs.

## Modified APIs

### 1. GET /api/reports/sales/summary (NEW)
**Description:** Get sales summary statistics with datewise filter

**Query Parameters:**
- `start_date` (required): Start date for filtering (YYYY-MM-DD)
- `end_date` (required): End date for filtering (YYYY-MM-DD)

**Response Structure:**
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
      { "status": "pending", "count": 30, "amount": 64000 },
      { "status": "confirmed", "count": 50, "amount": 106666.67 },
      { "status": "delivered", "count": 70, "amount": 149333.33 }
    ],
    "payment_status_breakdown": [
      { "payment_status": "paid", "count": 100, "amount": 213333.33 },
      { "payment_status": "pending", "count": 50, "amount": 106666.67 }
    ]
  }
}
```

**Example Usage:**
```bash
# Get sales summary for entire year 2025
GET /api/reports/sales/summary?start_date=2025-01-01&end_date=2025-12-31

# Get sales summary for December 2025
GET /api/reports/sales/summary?start_date=2025-12-01&end_date=2025-12-31

# Get sales summary for a specific week
GET /api/reports/sales/summary?start_date=2025-12-01&end_date=2025-12-07
```

---

### 2. GET /api/sales/reports/charts (UPDATED)
**Description:** Get sales chart data with datewise filter

**Previous Implementation:**
- Used period-based filters: `period`, `year`, `month`, `quarter`
- Supported: monthly, weekly, quarterly, yearly aggregations

**New Implementation:**
- Uses datewise filters: `start_date`, `end_date`
- Returns daily aggregated data for the specified date range

**Query Parameters:**
- `start_date` (required): Start date for filtering (YYYY-MM-DD)
- `end_date` (required): End date for filtering (YYYY-MM-DD)

**Response Structure:**
```json
{
  "status": true,
  "message": "Chart data retrieved successfully",
  "data": {
    "start_date": "2025-01-01",
    "end_date": "2025-01-31",
    "data": [
      { "date": "2025-01-01", "amount": 5000, "order_count": 15 },
      { "date": "2025-01-02", "amount": 6000, "order_count": 18 },
      { "date": "2025-01-03", "amount": 4500, "order_count": 13 }
    ]
  }
}
```

**Example Usage:**
```bash
# Get daily data for January 2025
GET /api/sales/reports/charts?start_date=2025-01-01&end_date=2025-01-31

# Get data for a specific week
GET /api/sales/reports/charts?start_date=2025-12-01&end_date=2025-12-07

# Get data for entire year (will return daily data)
GET /api/sales/reports/charts?start_date=2025-01-01&end_date=2025-12-31
```

---

## Files Modified

### 1. `/src/modules/sales/sales.service.js`
**Changes:**
- **Removed:** `getReportsCharts(period, year, month, quarter)` - Old period-based implementation
- **Added:** `getReportsCharts(start_date, end_date)` - New datewise implementation
- **Added:** `getSalesSummary(start_date, end_date)` - New summary endpoint

**Key Implementation Details:**
- Uses MySQL `DATE()` function to group by date
- Filters orders using `BETWEEN` operator on `order_date` column
- Returns daily aggregated data (date, amount, order_count)
- Summary includes total orders, sales, average order value, tax, and discount
- Provides status and payment status breakdowns

### 2. `/src/modules/sales/sales.controller.js`
**Changes:**
- **Updated:** `getReportsCharts(req, res)` - Now expects `start_date` and `end_date` query params
- **Added:** `getSalesSummary(req, res)` - New controller method for summary endpoint

**Validation:**
- Both methods validate that `start_date` and `end_date` are provided
- Returns 400 error if parameters are missing

### 3. `/src/modules/sales/sales.routes.js`
**Changes:**
- **Added:** New route for `/reports/sales/summary` (GET)
- **Updated:** Existing route `/reports/charts` documentation and examples
- Updated query parameters documentation
- Updated sample responses and examples

---

## Breaking Changes

⚠️ **IMPORTANT:** The `/api/sales/reports/charts` endpoint has breaking changes:

**Old Parameters (REMOVED):**
- `period` - No longer supported
- `year` - No longer supported
- `month` - No longer supported
- `quarter` - No longer supported

**New Parameters (REQUIRED):**
- `start_date` - Required (YYYY-MM-DD format)
- `end_date` - Required (YYYY-MM-DD format)

**Migration Guide:**
If you were using the old API:
```bash
# OLD (no longer works)
GET /api/sales/reports/charts?period=monthly&year=2025

# NEW (equivalent)
GET /api/sales/reports/charts?start_date=2025-01-01&end_date=2025-12-31
```

---

## Testing

A test script has been created at `/test-sales-datewise-api.js` to verify the implementation.

**To run the tests:**
1. Update the `TOKEN` variable in the test file with a valid auth token
2. Ensure the server is running
3. Run: `node test-sales-datewise-api.js`

**Test Coverage:**
- ✅ Sales summary with valid date range
- ✅ Sales charts with valid date range
- ✅ Error handling for missing parameters
- ✅ Different date range scenarios (week, month, year)

---

## Database Queries

### Sales Summary Query
```sql
-- Total statistics
SELECT 
  COUNT(id) as total_orders,
  SUM(total_amount) as total_sales,
  AVG(total_amount) as average_order_value,
  SUM(tax_amount) as total_tax,
  SUM(discount_amount) as total_discount
FROM orders
WHERE order_date BETWEEN '2025-01-01' AND '2025-12-31';

-- Status breakdown
SELECT 
  status,
  COUNT(id) as count,
  SUM(total_amount) as amount
FROM orders
WHERE order_date BETWEEN '2025-01-01' AND '2025-12-31'
GROUP BY status;

-- Payment status breakdown
SELECT 
  payment_status,
  COUNT(id) as count,
  SUM(total_amount) as amount
FROM orders
WHERE order_date BETWEEN '2025-01-01' AND '2025-12-31'
GROUP BY payment_status;
```

### Sales Charts Query
```sql
SELECT 
  DATE(order_date) as date,
  SUM(total_amount) as amount,
  COUNT(id) as order_count
FROM orders
WHERE order_date BETWEEN '2025-01-01' AND '2025-01-31'
GROUP BY DATE(order_date)
ORDER BY DATE(order_date) ASC;
```

---

## Benefits of Datewise Filter

1. **Flexibility:** Users can query any custom date range
2. **Simplicity:** Single, consistent API interface
3. **Performance:** More efficient queries with direct date filtering
4. **Consistency:** Same filter pattern across both endpoints
5. **Frontend Control:** Frontend can implement any aggregation logic (daily, weekly, monthly, etc.)

---

## Next Steps

1. ✅ Update frontend applications to use new API parameters
2. ✅ Remove any references to old period-based parameters
3. ✅ Test with production data
4. ✅ Update API documentation
5. ✅ Notify API consumers of breaking changes

---

## Support

For questions or issues, please refer to:
- API Documentation: `/src/modules/sales/sales.routes.js`
- Test Script: `/test-sales-datewise-api.js`
- Service Implementation: `/src/modules/sales/sales.service.js`
