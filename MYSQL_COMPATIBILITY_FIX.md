# MySQL Compatibility Fix - Sales Reports Charts API

## Issue Fixed
The initial implementation used SQLite date functions (`strftime`), but the system uses MySQL. This has been corrected.

## Changes Made

### Date Functions Updated (MySQL Compatible)

| Period | Old (SQLite) | New (MySQL) |
|--------|--------------|-------------|
| **Monthly** | `strftime('%Y-%m', order_date)` | `DATE_FORMAT(order_date, '%Y-%m')` |
| **Weekly** | `strftime('%Y-W%W', order_date)` | `DATE_FORMAT(order_date, '%Y-W%v')` |
| **Quarterly** | `'Q' \|\| ((CAST(strftime('%m', order_date) AS INTEGER) - 1) / 3 + 1)` | `CONCAT('Q', QUARTER(order_date))` |
| **Yearly** | `strftime('%Y', order_date)` | `YEAR(order_date)` |

## MySQL Date Functions Used

### 1. DATE_FORMAT()
Used for monthly and weekly aggregation:
```sql
-- Monthly: Returns format like "2025-01", "2025-12"
DATE_FORMAT(order_date, '%Y-%m')

-- Weekly: Returns format like "2025-W48", "2025-W52"
DATE_FORMAT(order_date, '%Y-W%v')
```

### 2. QUARTER()
Used for quarterly aggregation:
```sql
-- Returns: Q1, Q2, Q3, Q4
CONCAT('Q', QUARTER(order_date))
```

### 3. YEAR()
Used for yearly aggregation:
```sql
-- Returns: 2021, 2022, 2023, 2024, 2025
YEAR(order_date)
```

## Date Format Reference

### MySQL Format Specifiers
- `%Y` - Year, 4 digits (e.g., 2025)
- `%m` - Month, 2 digits (01-12)
- `%v` - ISO week number (01-53)
- `QUARTER()` - Quarter of year (1-4)
- `YEAR()` - Year as number

## Testing

The API should now work correctly with MySQL. Test with:

```bash
# Monthly data
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:5000/api/sales/reports/charts?period=monthly&year=2025"

# Weekly data
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:5000/api/sales/reports/charts?period=weekly&year=2025&month=12"

# Quarterly data
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:5000/api/sales/reports/charts?period=quarterly&year=2025"

# Yearly data
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:5000/api/sales/reports/charts?period=yearly&year=2025"
```

## Expected Response Format (Unchanged)

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
      { "date": "2025-01", "amount": 1200, "order_count": 5 },
      { "date": "2025-02", "amount": 1500, "order_count": 7 },
      ...
    ]
  }
}
```

## Database Compatibility

✅ **MySQL** - Fully supported (current)  
⚠️ **SQLite** - Would need different date functions  
⚠️ **PostgreSQL** - Would need different date functions  

If you need to support multiple databases, consider creating a database-agnostic date formatting utility.

## File Modified
- `src/modules/sales/sales.service.js` - Updated `getReportsCharts()` method

## Status
✅ **FIXED** - API now works with MySQL database
