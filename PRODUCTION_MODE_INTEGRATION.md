# Production Mode Feature - Integration Guide

## Overview
Add a dev/production mode toggle to your File Manager at `http://localhost:8080/websites/1/files/`

## Features
✅ Toggle between Development and Production modes
✅ Visual indicators (badges, warnings)
✅ Production mode warnings for dangerous operations
✅ JavaScript confirmations for delete/upload/save in production
✅ Optional operation logging in production mode
✅ Session-based mode persistence

## Quick Integration

### Step 1: Update files.php
Open `/Applications/MAMP/htdocs/server-maanger/php-server-manager/views/websites/files.php`

Add this at the top (after any session_start() or includes):

```php
<?php
// Production Mode Feature
if (!isset($_SESSION['production_mode'])) {
    $_SESSION['production_mode'] = 'dev';
}

if (isset($_POST['change_mode'])) {
    $_SESSION['production_mode'] = $_POST['mode'] === 'production' ? 'production' : 'dev';
    header('Location: ' . $_SERVER['PHP_SELF'] . '?id=' . $_GET['id']);
    exit;
}

$currentMode = $_SESSION['production_mode'];
$isProduction = $currentMode === 'production';
?>
```

### Step 2: Add the Mode Selector UI
Copy the HTML/CSS from `production-mode-feature.php` and paste it where you want the mode selector to appear (typically in the toolbar or header area).

### Step 3: Add JavaScript Confirmations
Copy the JavaScript section from `production-mode-feature.php` and add it before the closing `</body>` tag.

## File Structure

```
/Applications/MAMP/htdocs/server-maanger/php-server-manager/
├── views/
│   └── websites/
│       └── files.php          ← Update this file
├── logs/
│   └── production-operations.log  ← Create this for logging (optional)
```

## Manual Integration Steps

### 1. Session Management (Add to top of files.php)
```php
// Initialize mode
if (!isset($_SESSION['production_mode'])) {
    $_SESSION['production_mode'] = 'dev';
}

// Handle mode changes
if (isset($_POST['change_mode'])) {
    $_SESSION['production_mode'] = $_POST['mode'] === 'production' ? 'production' : 'dev';
    header('Location: ' . $_SERVER['PHP_SELF'] . '?id=' . $_GET['id']);
    exit;
}

$currentMode = $_SESSION['production_mode'];
$isProduction = $currentMode === 'production';
```

### 2. Add Mode Selector (Add in toolbar/header)
```html
<div class="mode-selector">
    <label>Environment:</label>
    <form method="POST" style="margin: 0;">
        <div class="mode-toggle">
            <input type="radio" name="mode" id="mode-dev" value="dev" 
                   <?php echo !$isProduction ? 'checked' : ''; ?> 
                   onchange="this.form.submit()">
            <label for="mode-dev">Development</label>
            
            <input type="radio" name="mode" id="mode-production" value="production" 
                   <?php echo $isProduction ? 'checked' : ''; ?> 
                   onchange="this.form.submit()">
            <label for="mode-production">Production</label>
        </div>
        <input type="hidden" name="change_mode" value="1">
    </form>
    <span class="mode-badge <?php echo $currentMode; ?>">
        <?php echo strtoupper($currentMode); ?>
    </span>
</div>
```

### 3. Add Production Warning (Optional)
```php
<?php if ($isProduction): ?>
<div class="production-warning">
    <svg width="20" height="20" fill="#856404" viewBox="0 0 16 16">
        <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
    </svg>
    <p><strong>Production Mode:</strong> Be careful when editing files.</p>
</div>
<?php endif; ?>
```

### 4. Add Operation Restrictions (Optional)
```php
// Add this function
function canPerformOperation($operation, $isProduction) {
    $restrictedOperations = ['delete', 'rename'];
    
    if ($isProduction && in_array($operation, $restrictedOperations)) {
        return false; // Block in production
    }
    return true;
}

// Use in your file operations
if (isset($_POST['delete_file'])) {
    if (!canPerformOperation('delete', $isProduction)) {
        $_SESSION['error'] = 'File deletion is restricted in production mode';
        header('Location: ' . $_SERVER['PHP_SELF']);
        exit;
    }
    // Proceed with deletion
}
```

### 5. Add JavaScript Confirmations
```javascript
<script>
const isProduction = <?php echo $isProduction ? 'true' : 'false'; ?>;

document.addEventListener('DOMContentLoaded', function() {
    if (isProduction) {
        // Confirm before delete
        document.querySelectorAll('.delete-file, .delete-folder').forEach(btn => {
            btn.addEventListener('click', function(e) {
                if (!confirm('⚠️ PRODUCTION: Are you sure? This cannot be undone.')) {
                    e.preventDefault();
                }
            });
        });
        
        // Confirm before save
        document.querySelectorAll('.save-file').forEach(btn => {
            btn.addEventListener('click', function(e) {
                if (!confirm('⚠️ PRODUCTION: Save changes to this file?')) {
                    e.preventDefault();
                }
            });
        });
    }
});
</script>
```

## CSS Styling
All CSS is included in `production-mode-feature.php`. Copy the `<style>` block to your files.php or external CSS file.

## Testing

1. **Test Mode Toggle:**
   - Click "Development" - should show green badge
   - Click "Production" - should show red badge and warning

2. **Test Confirmations (Production Mode):**
   - Try to delete a file - should show confirmation
   - Try to save a file - should show confirmation
   - Try to upload a file - should show confirmation

3. **Test Mode Persistence:**
   - Set to Production
   - Refresh page
   - Should still be in Production mode

## Optional Enhancements

### 1. Add Logging
```php
function logProductionOperation($operation, $file, $user) {
    $logFile = __DIR__ . '/../../logs/production-operations.log';
    $timestamp = date('Y-m-d H:i:s');
    $logEntry = "[$timestamp] User: $user | Operation: $operation | File: $file\n";
    
    // Create logs directory if it doesn't exist
    $logDir = dirname($logFile);
    if (!is_dir($logDir)) {
        mkdir($logDir, 0755, true);
    }
    
    file_put_contents($logFile, $logEntry, FILE_APPEND);
}
```

### 2. Add to Page Title
```javascript
document.title = '<?php echo $isProduction ? '🔴 PRODUCTION' : '🟢 DEV'; ?> - File Manager';
```

### 3. Add Visual Indicator to Body
```php
<body class="<?php echo $isProduction ? 'production-mode' : 'dev-mode'; ?>">
```

```css
body.production-mode {
    border-top: 3px solid #dc3545;
}

body.dev-mode {
    border-top: 3px solid #28a745;
}
```

## Troubleshooting

**Mode doesn't persist:**
- Make sure `session_start()` is called before the mode code
- Check if sessions are working properly

**Toggle doesn't work:**
- Verify the form is submitting correctly
- Check browser console for JavaScript errors
- Ensure `$_POST['change_mode']` is being received

**Confirmations not showing:**
- Check if JavaScript is enabled
- Verify class names match your HTML elements
- Check browser console for errors

## Files Reference

- **Feature Code:** `/Applications/MAMP/htdocs/backened-erp-minimal/production-mode-feature.php`
- **This Guide:** `/Applications/MAMP/htdocs/backened-erp-minimal/PRODUCTION_MODE_INTEGRATION.md`
- **Target File:** `/Applications/MAMP/htdocs/server-maanger/php-server-manager/views/websites/files.php`

## Next Steps

1. ✅ Open `files.php` in your editor
2. ✅ Add session management code at the top
3. ✅ Add mode selector UI in the toolbar
4. ✅ Add CSS styling
5. ✅ Add JavaScript confirmations
6. ✅ Test the feature
7. ✅ (Optional) Add logging and restrictions

Need help? Check `production-mode-feature.php` for the complete code!
