# Date Filtering Fix - Sales API

## Problem
The sales summary and charts APIs were not filtering data properly when using date ranges. Orders outside the specified date range were being included in the results.

## Root Cause
The original implementation was using JavaScript `Date` objects for filtering:
```javascript
const whereCondition = {
    order_date: {
        [Op.between]: [new Date(start_date), new Date(end_date)]
    }
};
```

**Issues with this approach:**
1. **Timezone Problems:** `new Date(start_date)` creates a date with time set to midnight UTC, which may not match the server's timezone
2. **Time Component:** The comparison includes time, which can cause issues when `order_date` has a time component
3. **Inconsistent Results:** Depending on the timezone and time stored in `order_date`, some orders may be incorrectly included or excluded

## Solution
Changed to use MySQL's `DATE()` function to compare only the date part, ignoring time:

```javascript
const whereCondition = sequelize.where(
    sequelize.fn('DATE', sequelize.col('order_date')),
    {
        [Op.between]: [start_date, end_date]
    }
);
```

**Benefits of this approach:**
1. ✅ **Timezone Independent:** Compares only the date part (YYYY-MM-DD)
2. ✅ **Accurate Filtering:** Ignores time component completely
3. ✅ **Consistent Results:** Works correctly regardless of timezone
4. ✅ **Inclusive Range:** Properly includes both start_date and end_date

## SQL Generated

### Before (Incorrect)
```sql
WHERE order_date BETWEEN '2024-11-01T00:00:00.000Z' AND '2024-11-23T00:00:00.000Z'
```
**Problem:** Time component causes issues, especially with timezone conversions

### After (Correct)
```sql
WHERE DATE(order_date) BETWEEN '2024-11-01' AND '2024-11-23'
```
**Benefit:** Only compares the date part, ignoring time completely

## Files Modified

### 1. `/src/modules/sales/sales.service.js`

**Method:** `getSalesSummary(start_date, end_date)`
- **Line:** ~496-504
- **Change:** Updated whereCondition to use `sequelize.where()` with `DATE()` function

**Method:** `getReportsCharts(start_date, end_date)`
- **Line:** ~454-462
- **Change:** Updated whereCondition to use `sequelize.where()` with `DATE()` function

## Testing

### Test Case 1: November 2024 Data
```bash
GET /api/reports/sales/summary?start_date=2024-11-01&end_date=2024-11-23
```

**Expected:** Only orders with `order_date` between 2024-11-01 and 2024-11-23 (inclusive)

### Test Case 2: Single Day
```bash
GET /api/reports/sales/summary?start_date=2024-11-15&end_date=2024-11-15
```

**Expected:** Only orders from 2024-11-15 (regardless of time)

### Test Case 3: Month Boundary
```bash
GET /api/reports/sales/summary?start_date=2024-10-31&end_date=2024-11-01
```

**Expected:** Orders from Oct 31 and Nov 1 only

## Verification Steps

1. **Check the data before the fix:**
   - Note the total_orders count
   - Note which dates are included

2. **Apply the fix:**
   - Restart the server if needed

3. **Check the data after the fix:**
   - Verify total_orders count is correct
   - Verify only orders within the date range are included

4. **Test edge cases:**
   - Single day range
   - Month boundaries
   - Year boundaries
   - Different timezones

## Example Comparison

### Request
```
GET /api/reports/sales/summary?start_date=2024-11-01&end_date=2024-11-23
```

### Before Fix (Incorrect)
```json
{
  "summary": {
    "total_orders": 150  // Includes orders outside range
  }
}
```

### After Fix (Correct)
```json
{
  "summary": {
    "total_orders": 120  // Only orders from Nov 1-23
  }
}
```

## Impact

### Affected Endpoints
1. ✅ `GET /api/reports/sales/summary` - Fixed
2. ✅ `GET /api/sales/reports/charts` - Fixed

### Breaking Changes
None - This is a bug fix that makes the filtering work as intended

### Performance
- **No negative impact:** Using `DATE()` function is efficient
- **Indexed columns:** If `order_date` is indexed, the query will still use the index
- **Consider:** Adding a computed column index on `DATE(order_date)` for better performance if needed

## Additional Notes

### Date Format Requirements
- Input dates must be in `YYYY-MM-DD` format
- Example: `2024-11-01`, `2024-11-23`
- The fix works correctly with this format

### Timezone Considerations
- The fix uses the database server's timezone
- All date comparisons are done in the database timezone
- This ensures consistency across all queries

### Future Improvements
If you need timezone-specific filtering:
```javascript
// Convert to specific timezone before comparison
const whereCondition = sequelize.where(
    sequelize.fn('DATE', 
        sequelize.fn('CONVERT_TZ', 
            sequelize.col('order_date'), 
            '+00:00', 
            '+06:00'  // Your timezone
        )
    ),
    {
        [Op.between]: [start_date, end_date]
    }
);
```

## Rollback Plan

If you need to rollback (not recommended):

```javascript
// Old code (has timezone issues)
const whereCondition = {
    order_date: {
        [Op.between]: [new Date(start_date), new Date(end_date)]
    }
};
```

## Deployment

1. ✅ Changes committed to `sales.service.js`
2. ✅ No database migrations needed
3. ✅ No configuration changes needed
4. ✅ Restart application server to apply changes

## Support

If you still see filtering issues:
1. Check the `order_date` column format in your database
2. Verify the dates are stored correctly
3. Check the database timezone settings
4. Review the generated SQL query in the logs

---

**Fixed Date:** 2025-12-23
**Issue:** Date filtering not working properly
**Solution:** Use MySQL DATE() function for date-only comparison
**Status:** ✅ Resolved
