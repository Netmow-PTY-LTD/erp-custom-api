# Fix for FileManager.php Missing File Error

## Problem
The file `/Applications/MAMP/htdocs/server-maanger/php-server-manager/views/websites/files.php` is trying to require `../Utils/FileManager.php` which doesn't exist.

## Solution

### Step 1: Create the Utils Directory
Create the directory if it doesn't exist:
```bash
mkdir -p /Applications/MAMP/htdocs/server-maanger/php-server-manager/views/Utils
```

### Step 2: Copy the FileManager.php File
Copy the FileManager.php file I created to the correct location:
```bash
cp /Applications/MAMP/htdocs/backened-erp-minimal/FileManager.php /Applications/MAMP/htdocs/server-maanger/php-server-manager/views/Utils/FileManager.php
```

### Step 3: Verify the File Exists
```bash
ls -la /Applications/MAMP/htdocs/server-maanger/php-server-manager/views/Utils/FileManager.php
```

### Step 4: Refresh the Browser
After copying the file, refresh the page at http://localhost:8080/websites/1/files

## Alternative: Manual Copy
If you prefer to do it manually:
1. Open the file: `/Applications/MAMP/htdocs/backened-erp-minimal/FileManager.php`
2. Copy all the contents
3. Create a new file: `/Applications/MAMP/htdocs/server-maanger/php-server-manager/views/Utils/FileManager.php`
4. Paste the contents
5. Save the file

## What the FileManager Class Does
The FileManager utility class provides:
- ✅ List files and directories
- ✅ Read and write files
- ✅ Create and delete directories
- ✅ Upload files
- ✅ Search for files
- ✅ Get disk usage
- ✅ Rename/move files
- ✅ Security: Prevents directory traversal attacks
- ✅ File size formatting

## Quick Fix Command
Run this single command to fix the issue:
```bash
mkdir -p /Applications/MAMP/htdocs/server-maanger/php-server-manager/views/Utils && cp /Applications/MAMP/htdocs/backened-erp-minimal/FileManager.php /Applications/MAMP/htdocs/server-maanger/php-server-manager/views/Utils/FileManager.php
```

After running this command, the error should be resolved!
