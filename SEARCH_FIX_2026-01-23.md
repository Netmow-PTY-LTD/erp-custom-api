# Search Functionality Fix - January 23, 2026

## Issue
Both `/api/reports/sales/by-customer` and `/api/reports/customers/account-receivables` endpoints were not filtering data correctly when using the `search` parameter. The endpoints were returning all data with incorrect pagination.

## Root Cause
1. The `search` parameter was not being extracted from the request query in the controllers
2. The service methods did not accept or use the `search` parameter
3. SQL queries did not include search conditions

## Solution

### 1. Sales by Customer Endpoint
**File**: `src/modules/reports/reports.service.js`

**Changes**:
- Added `search` parameter to `getSalesByCustomer()` method
- Implemented SQL WHERE clause to filter by customer name using LIKE
- Fixed count query to use table alias `c` for consistency
- Applied search filter to both data query and count query

**File**: `src/modules/reports/reports.controller.js`

**Changes**:
- Extract `search` parameter from `req.query.search`
- Pass search parameter to service method

### 2. Account Receivables Endpoint
**File**: `src/modules/reports/reports.service.js`

**Changes**:
- Added `search` parameter to `getAccountReceivables()` method
- Built dynamic WHERE clause array to include search condition
- Added customer name filter using LIKE
- Updated count query to include customer table JOIN for search
- Applied search filter to both data query and count query

**File**: `src/modules/reports/reports.controller.js`

**Changes**:
- Extract `search` parameter from `req.query.search`
- Pass search parameter to service method

## Testing Results

### Test 1: Sales by Customer (No Search)
```bash
GET /api/reports/sales/by-customer?page=1&limit=5
```
**Result**: ✅ Returns 24 total customers, showing 5 per page

### Test 2: Sales by Customer (With Search)
```bash
GET /api/reports/sales/by-customer?page=1&limit=10&search=Aina+Sofea
```
**Result**: ✅ Returns 1 matching customer
```json
{
  "success": true,
  "pagination": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "totalPage": 1
  },
  "data": [
    {
      "customer": "Aina Sofea",
      "orders": 1,
      "sales": "375.00"
    }
  ]
}
```

### Test 3: Account Receivables (No Search)
```bash
GET /api/reports/customers/account-receivables?page=1&limit=5
```
**Result**: ✅ Returns 16 total receivables, showing 5 per page

### Test 4: Account Receivables (With Search)
```bash
GET /api/reports/customers/account-receivables?page=1&limit=10&search=Aina+Sofea
```
**Result**: ✅ Returns 1 matching receivable
```json
{
  "success": true,
  "pagination": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "totalPage": 1
  },
  "data": [
    {
      "invoiceNumber": "INV-1768904154159-835",
      "customer": "Aina Sofea",
      "date": "2026-01-20",
      "due": "2026-01-20",
      "total": 375,
      "paid": 0,
      "balance": 375
    }
  ]
}
```

## Files Modified
1. `src/modules/reports/reports.service.js`
   - `getSalesByCustomer()` - Added search parameter and SQL filtering
   - `getAccountReceivables()` - Added search parameter and SQL filtering

2. `src/modules/reports/reports.controller.js`
   - `getSalesByCustomer()` - Extract and pass search parameter
   - `getAccountReceivables()` - Extract and pass search parameter

## Key Features
- ✅ Case-insensitive search using SQL LIKE with wildcards (`%search%`)
- ✅ Correct pagination counts when search is applied
- ✅ Backward compatible (search parameter is optional)
- ✅ Works with URL-encoded spaces (e.g., `Aina+Sofea` or `Aina%20Sofea`)

## Usage Examples

### Search for specific customer in sales report
```bash
curl -X GET "http://192.168.0.176:5000/api/reports/sales/by-customer?page=1&limit=10&search=Aina+Sofea" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Search for specific customer in receivables
```bash
curl -X GET "http://192.168.0.176:5000/api/reports/customers/account-receivables?page=1&limit=10&search=Aina+Sofea" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Partial name search
```bash
# Search for all customers with "Aina" in their name
curl -X GET "http://192.168.0.176:5000/api/reports/sales/by-customer?search=Aina" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

**Status**: ✅ Fixed and Verified  
**Date**: January 23, 2026  
**Time**: 17:04 +06:00
