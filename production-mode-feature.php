<?php
/**
 * Production Mode Feature for File Manager
 * Add this code to your files.php page
 */

// 1. Add this at the top of your files.php (after session_start or similar)
// ============================================================================

// Get current mode from session or default to 'dev'
if (!isset($_SESSION['production_mode'])) {
    $_SESSION['production_mode'] = 'dev';
}

// Handle mode change
if (isset($_POST['change_mode'])) {
    $_SESSION['production_mode'] = $_POST['mode'] === 'production' ? 'production' : 'dev';
    header('Location: ' . $_SERVER['PHP_SELF'] . '?id=' . $_GET['id']);
    exit;
}

$currentMode = $_SESSION['production_mode'];
$isProduction = $currentMode === 'production';

// 2. Add this HTML/CSS in your page header or toolbar section
// ============================================================================
?>

<!-- Production Mode Selector -->
<style>
.mode-selector {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 8px 16px;
    background: #f8f9fa;
    border-radius: 8px;
    border: 1px solid #dee2e6;
    margin-bottom: 15px;
}

.mode-selector label {
    font-weight: 600;
    color: #495057;
    margin: 0;
    font-size: 14px;
}

.mode-toggle {
    position: relative;
    display: inline-flex;
    background: #fff;
    border-radius: 6px;
    border: 1px solid #ced4da;
    overflow: hidden;
}

.mode-toggle input[type="radio"] {
    display: none;
}

.mode-toggle label {
    padding: 6px 16px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 500;
    transition: all 0.3s ease;
    border: none;
    margin: 0;
}

.mode-toggle input[type="radio"]:checked + label {
    background: #007bff;
    color: white;
}

.mode-toggle label:hover {
    background: #e9ecef;
}

.mode-toggle input[type="radio"]:checked + label:hover {
    background: #0056b3;
}

.mode-dev {
    color: #28a745;
}

.mode-production {
    color: #dc3545;
}

.mode-badge {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
}

.mode-badge.dev {
    background: #d4edda;
    color: #155724;
}

.mode-badge.production {
    background: #f8d7da;
    color: #721c24;
}

.production-warning {
    background: #fff3cd;
    border: 1px solid #ffc107;
    border-radius: 6px;
    padding: 12px 16px;
    margin-bottom: 15px;
    display: flex;
    align-items: center;
    gap: 10px;
}

.production-warning svg {
    flex-shrink: 0;
}

.production-warning p {
    margin: 0;
    color: #856404;
    font-size: 14px;
}
</style>

<div class="mode-selector">
    <label>Environment:</label>
    <form method="POST" style="margin: 0;">
        <div class="mode-toggle">
            <input type="radio" name="mode" id="mode-dev" value="dev" <?php echo !$isProduction ? 'checked' : ''; ?> onchange="this.form.submit()">
            <label for="mode-dev" class="mode-dev">Development</label>
            
            <input type="radio" name="mode" id="mode-production" value="production" <?php echo $isProduction ? 'checked' : ''; ?> onchange="this.form.submit()">
            <label for="mode-production" class="mode-production">Production</label>
        </div>
        <input type="hidden" name="change_mode" value="1">
    </form>
    <span class="mode-badge <?php echo $currentMode; ?>">
        <?php echo strtoupper($currentMode); ?>
    </span>
</div>

<?php if ($isProduction): ?>
<div class="production-warning">
    <svg width="20" height="20" fill="#856404" viewBox="0 0 16 16">
        <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
    </svg>
    <p><strong>Production Mode:</strong> Be careful when editing files. Changes will affect the live website.</p>
</div>
<?php endif; ?>

<?php
// 3. Add mode-based restrictions in your FileManager operations
// ============================================================================

// Example: Restrict certain operations in production mode
function canPerformOperation($operation, $isProduction) {
    $restrictedOperations = ['delete', 'rename', 'upload'];
    
    if ($isProduction && in_array($operation, $restrictedOperations)) {
        // You can either block or require confirmation
        return false; // Block in production
    }
    
    return true;
}

// Example usage in your file operations:
/*
if (isset($_POST['delete_file'])) {
    if (!canPerformOperation('delete', $isProduction)) {
        $_SESSION['error'] = 'File deletion is restricted in production mode';
        header('Location: ' . $_SERVER['PHP_SELF']);
        exit;
    }
    // Proceed with deletion
}
*/

// 4. Add JavaScript confirmation for production mode
// ============================================================================
?>

<script>
const isProduction = <?php echo $isProduction ? 'true' : 'false'; ?>;

// Add confirmation for dangerous operations in production
document.addEventListener('DOMContentLoaded', function() {
    if (isProduction) {
        // Confirm before delete
        document.querySelectorAll('.delete-file, .delete-folder').forEach(btn => {
            btn.addEventListener('click', function(e) {
                if (!confirm('⚠️ PRODUCTION MODE: Are you sure you want to delete this? This action cannot be undone.')) {
                    e.preventDefault();
                    return false;
                }
            });
        });
        
        // Confirm before upload
        document.querySelectorAll('input[type="file"]').forEach(input => {
            input.addEventListener('change', function(e) {
                if (this.files.length > 0) {
                    if (!confirm('⚠️ PRODUCTION MODE: Are you sure you want to upload files to production?')) {
                        this.value = '';
                        e.preventDefault();
                        return false;
                    }
                }
            });
        });
        
        // Confirm before save
        document.querySelectorAll('.save-file, .update-file').forEach(btn => {
            btn.addEventListener('click', function(e) {
                if (!confirm('⚠️ PRODUCTION MODE: Are you sure you want to save changes to this file?')) {
                    e.preventDefault();
                    return false;
                }
            });
        });
    }
});
</script>

<?php
// 5. Optional: Add mode indicator to page title
// ============================================================================
?>
<script>
document.title = '<?php echo $isProduction ? '🔴 PRODUCTION' : '🟢 DEV'; ?> - File Manager';
</script>

<?php
// 6. Optional: Log all operations in production mode
// ============================================================================

function logProductionOperation($operation, $file, $user) {
    $logFile = __DIR__ . '/../../logs/production-operations.log';
    $timestamp = date('Y-m-d H:i:s');
    $logEntry = "[$timestamp] User: $user | Operation: $operation | File: $file\n";
    file_put_contents($logFile, $logEntry, FILE_APPEND);
}

// Example usage:
/*
if ($isProduction && isset($_POST['save_file'])) {
    logProductionOperation('file_edit', $_POST['filename'], $_SESSION['user']['username']);
}
*/
?>
