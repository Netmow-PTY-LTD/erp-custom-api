# Sales API Documentation Index

This directory contains comprehensive documentation for the Sales API with datewise filters.

## 📚 Documentation Files

### 1. **SALES_API_ROUTES_DOCUMENTATION.md** ⭐ Main Documentation
Complete API routes documentation with:
- ✅ Full route metadata for both endpoints
- ✅ Database tables and fields used
- ✅ SQL query patterns
- ✅ Request/Response examples
- ✅ Error handling
- ✅ Migration guide from old API
- ✅ Performance considerations
- ✅ Security notes

**Use this for:** Complete API reference and route metadata

---

### 2. **SALES_SUMMARY_API_REFERENCE.md** 📊 Summary Endpoint
Quick reference for `/api/reports/sales/summary`:
- ✅ All example requests
- ✅ Response structure
- ✅ cURL examples
- ✅ JavaScript/Axios examples
- ✅ Common use cases

**Use this for:** Quick lookup for summary endpoint

---

### 3. **SALES_CHARTS_API_REFERENCE.md** 📈 Charts Endpoint
Quick reference for `/api/sales/reports/charts`:
- ✅ All example requests
- ✅ Response structure
- ✅ cURL examples
- ✅ JavaScript/Axios examples
- ✅ React integration
- ✅ Chart.js integration

**Use this for:** Quick lookup for charts endpoint

---

### 4. **SALES_DATEWISE_FILTER_IMPLEMENTATION.md** 🔧 Implementation Guide
Technical implementation details:
- ✅ Files modified
- ✅ Breaking changes
- ✅ Migration guide
- ✅ Database queries
- ✅ Benefits of datewise filter

**Use this for:** Understanding the implementation

---

### 5. **test-sales-datewise-api.js** 🧪 Test Script
Automated test script for both endpoints:
- ✅ Tests sales summary endpoint
- ✅ Tests sales charts endpoint
- ✅ Tests error handling
- ✅ Tests missing parameters

**Use this for:** Testing the APIs

---

## 🚀 Quick Start

### 1. Test the APIs
```bash
node test-sales-datewise-api.js
```

### 2. Example Requests

**Sales Summary:**
```bash
curl -X GET "http://localhost:3000/api/reports/sales/summary?start_date=2025-01-01&end_date=2025-12-31" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Sales Charts:**
```bash
curl -X GET "http://localhost:3000/api/sales/reports/charts?start_date=2025-01-01&end_date=2025-12-31" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📋 API Endpoints Summary

### 1. GET /api/reports/sales/summary
**Purpose:** Get comprehensive sales statistics
**Parameters:** `start_date`, `end_date` (both required)
**Returns:** Total orders, sales, average order value, tax, discount, status breakdown, payment breakdown

### 2. GET /api/sales/reports/charts
**Purpose:** Get daily sales chart data
**Parameters:** `start_date`, `end_date` (both required)
**Returns:** Daily sales amount and order count

---

## 🗂️ File Structure

```
/Applications/MAMP/htdocs/backened-erp-minimal/
├── src/modules/sales/
│   ├── sales.routes.js          # Route definitions with metadata
│   ├── sales.controller.js      # Controller methods
│   ├── sales.service.js         # Business logic
│   └── sales.repository.js      # Database queries
├── SALES_API_ROUTES_DOCUMENTATION.md      # ⭐ Main documentation
├── SALES_SUMMARY_API_REFERENCE.md         # Summary endpoint reference
├── SALES_CHARTS_API_REFERENCE.md          # Charts endpoint reference
├── SALES_DATEWISE_FILTER_IMPLEMENTATION.md # Implementation guide
└── test-sales-datewise-api.js             # Test script
```

---

## 🔑 Key Features

✅ **Datewise Filtering** - Filter by any date range
✅ **Flexible** - Works for daily, weekly, monthly, quarterly, yearly reports
✅ **Comprehensive** - Summary statistics and chart data
✅ **Well Documented** - Complete route metadata
✅ **Tested** - Automated test script included
✅ **Secure** - Authentication required, input validation

---

## 📖 Route Metadata

Both endpoints have complete route metadata in `sales.routes.js`:

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
    fields: { /* ... */ }
  },
  queryParams: {
    start_date: 'Start date for filtering (YYYY-MM-DD) - Required',
    end_date: 'End date for filtering (YYYY-MM-DD) - Required'
  },
  sampleResponse: { /* ... */ },
  examples: [ /* ... */ ]
}
```

---

## 🎯 Common Use Cases

### Dashboard (Last 30 Days)
```javascript
const endDate = new Date().toISOString().split('T')[0];
const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  .toISOString().split('T')[0];

GET /api/reports/sales/summary?start_date=${startDate}&end_date=${endDate}
GET /api/sales/reports/charts?start_date=${startDate}&end_date=${endDate}
```

### Monthly Report
```javascript
GET /api/reports/sales/summary?start_date=2025-01-01&end_date=2025-01-31
GET /api/sales/reports/charts?start_date=2025-01-01&end_date=2025-01-31
```

### Quarterly Report
```javascript
GET /api/reports/sales/summary?start_date=2025-01-01&end_date=2025-03-31
GET /api/sales/reports/charts?start_date=2025-01-01&end_date=2025-03-31
```

### Yearly Report
```javascript
GET /api/reports/sales/summary?start_date=2025-01-01&end_date=2025-12-31
GET /api/sales/reports/charts?start_date=2025-01-01&end_date=2025-12-31
```

---

## ⚠️ Important Notes

1. **Both parameters are required** - `start_date` and `end_date`
2. **Date format** - Must be YYYY-MM-DD
3. **Date range is inclusive** - Includes both start and end dates
4. **Authentication required** - Bearer token must be provided
5. **Empty days not included** - Days with no orders are omitted from results

---

## 🔄 Migration from Old API

The old period-based API has been replaced:

**Old (Removed):**
```
?period=monthly&year=2025
?period=weekly&year=2025&month=12
?period=quarterly&year=2025
?period=yearly&year=2025
```

**New (Current):**
```
?start_date=2025-01-01&end_date=2025-12-31
```

See `SALES_DATEWISE_FILTER_IMPLEMENTATION.md` for complete migration guide.

---

## 📞 Support

For questions or issues:
1. Check the relevant documentation file above
2. Review the test script
3. Check route metadata in `sales.routes.js`
4. Review service implementation in `sales.service.js`

---

## ✅ Checklist for Developers

- [ ] Read `SALES_API_ROUTES_DOCUMENTATION.md` for complete API reference
- [ ] Review route metadata in `sales.routes.js`
- [ ] Run test script: `node test-sales-datewise-api.js`
- [ ] Update frontend to use new datewise parameters
- [ ] Remove old period-based parameter usage
- [ ] Test with various date ranges
- [ ] Implement error handling for missing parameters

---

**Last Updated:** 2025-12-23
**Version:** 2.0 (Datewise Filter Implementation)
