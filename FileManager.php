<?php

/**
 * FileManager Utility Class
 * Handles file and directory operations for the VPS Server Manager
 */
class FileManager {
    
    private $basePath;
    private $allowedExtensions = ['php', 'html', 'css', 'js', 'json', 'txt', 'md', 'xml', 'yml', 'yaml', 'env', 'htaccess', 'conf'];
    
    public function __construct($basePath = null) {
        $this->basePath = $basePath ?: '/var/www/html';
    }
    
    /**
     * List files and directories in a given path
     */
    public function listDirectory($path = '') {
        $fullPath = $this->getFullPath($path);
        
        if (!is_dir($fullPath)) {
            throw new Exception("Directory not found: $path");
        }
        
        $items = [];
        $files = scandir($fullPath);
        
        foreach ($files as $file) {
            if ($file === '.' || $file === '..') {
                continue;
            }
            
            $filePath = $fullPath . '/' . $file;
            $relativePath = $path ? $path . '/' . $file : $file;
            
            $items[] = [
                'name' => $file,
                'path' => $relativePath,
                'type' => is_dir($filePath) ? 'directory' : 'file',
                'size' => is_file($filePath) ? filesize($filePath) : 0,
                'modified' => filemtime($filePath),
                'permissions' => substr(sprintf('%o', fileperms($filePath)), -4),
                'readable' => is_readable($filePath),
                'writable' => is_writable($filePath)
            ];
        }
        
        // Sort: directories first, then files
        usort($items, function($a, $b) {
            if ($a['type'] === $b['type']) {
                return strcasecmp($a['name'], $b['name']);
            }
            return $a['type'] === 'directory' ? -1 : 1;
        });
        
        return $items;
    }
    
    /**
     * Read file contents
     */
    public function readFile($path) {
        $fullPath = $this->getFullPath($path);
        
        if (!file_exists($fullPath)) {
            throw new Exception("File not found: $path");
        }
        
        if (!is_file($fullPath)) {
            throw new Exception("Not a file: $path");
        }
        
        if (!is_readable($fullPath)) {
            throw new Exception("File not readable: $path");
        }
        
        return file_get_contents($fullPath);
    }
    
    /**
     * Write content to file
     */
    public function writeFile($path, $content) {
        $fullPath = $this->getFullPath($path);
        
        if (!is_writable(dirname($fullPath))) {
            throw new Exception("Directory not writable: " . dirname($path));
        }
        
        $result = file_put_contents($fullPath, $content);
        
        if ($result === false) {
            throw new Exception("Failed to write file: $path");
        }
        
        return true;
    }
    
    /**
     * Create a new directory
     */
    public function createDirectory($path) {
        $fullPath = $this->getFullPath($path);
        
        if (file_exists($fullPath)) {
            throw new Exception("Directory already exists: $path");
        }
        
        if (!mkdir($fullPath, 0755, true)) {
            throw new Exception("Failed to create directory: $path");
        }
        
        return true;
    }
    
    /**
     * Delete a file
     */
    public function deleteFile($path) {
        $fullPath = $this->getFullPath($path);
        
        if (!file_exists($fullPath)) {
            throw new Exception("File not found: $path");
        }
        
        if (!is_file($fullPath)) {
            throw new Exception("Not a file: $path");
        }
        
        if (!unlink($fullPath)) {
            throw new Exception("Failed to delete file: $path");
        }
        
        return true;
    }
    
    /**
     * Delete a directory (recursively)
     */
    public function deleteDirectory($path) {
        $fullPath = $this->getFullPath($path);
        
        if (!file_exists($fullPath)) {
            throw new Exception("Directory not found: $path");
        }
        
        if (!is_dir($fullPath)) {
            throw new Exception("Not a directory: $path");
        }
        
        $this->deleteDirectoryRecursive($fullPath);
        
        return true;
    }
    
    /**
     * Rename/move a file or directory
     */
    public function rename($oldPath, $newPath) {
        $fullOldPath = $this->getFullPath($oldPath);
        $fullNewPath = $this->getFullPath($newPath);
        
        if (!file_exists($fullOldPath)) {
            throw new Exception("Source not found: $oldPath");
        }
        
        if (file_exists($fullNewPath)) {
            throw new Exception("Destination already exists: $newPath");
        }
        
        if (!rename($fullOldPath, $fullNewPath)) {
            throw new Exception("Failed to rename: $oldPath to $newPath");
        }
        
        return true;
    }
    
    /**
     * Upload a file
     */
    public function uploadFile($uploadedFile, $destinationPath) {
        if (!isset($uploadedFile['tmp_name']) || !is_uploaded_file($uploadedFile['tmp_name'])) {
            throw new Exception("Invalid uploaded file");
        }
        
        $fullPath = $this->getFullPath($destinationPath);
        
        if (!move_uploaded_file($uploadedFile['tmp_name'], $fullPath)) {
            throw new Exception("Failed to upload file: $destinationPath");
        }
        
        return true;
    }
    
    /**
     * Get file information
     */
    public function getFileInfo($path) {
        $fullPath = $this->getFullPath($path);
        
        if (!file_exists($fullPath)) {
            throw new Exception("File not found: $path");
        }
        
        return [
            'name' => basename($fullPath),
            'path' => $path,
            'type' => is_dir($fullPath) ? 'directory' : 'file',
            'size' => is_file($fullPath) ? filesize($fullPath) : 0,
            'modified' => filemtime($fullPath),
            'permissions' => substr(sprintf('%o', fileperms($fullPath)), -4),
            'readable' => is_readable($fullPath),
            'writable' => is_writable($fullPath),
            'extension' => is_file($fullPath) ? pathinfo($fullPath, PATHINFO_EXTENSION) : null
        ];
    }
    
    /**
     * Search for files
     */
    public function search($searchTerm, $path = '') {
        $fullPath = $this->getFullPath($path);
        $results = [];
        
        $this->searchRecursive($fullPath, $searchTerm, $path, $results);
        
        return $results;
    }
    
    /**
     * Get disk usage for a path
     */
    public function getDiskUsage($path = '') {
        $fullPath = $this->getFullPath($path);
        
        if (!file_exists($fullPath)) {
            throw new Exception("Path not found: $path");
        }
        
        if (is_file($fullPath)) {
            return filesize($fullPath);
        }
        
        $size = 0;
        $this->calculateDirectorySize($fullPath, $size);
        
        return $size;
    }
    
    /**
     * Check if path is safe (prevent directory traversal)
     */
    private function isSafePath($path) {
        $realBase = realpath($this->basePath);
        $realPath = realpath($this->basePath . '/' . $path);
        
        if ($realPath === false) {
            // Path doesn't exist yet, check the parent
            $realPath = realpath(dirname($this->basePath . '/' . $path));
        }
        
        return $realPath !== false && strpos($realPath, $realBase) === 0;
    }
    
    /**
     * Get full path from relative path
     */
    private function getFullPath($path) {
        $fullPath = $this->basePath . '/' . ltrim($path, '/');
        
        if (!$this->isSafePath($path)) {
            throw new Exception("Invalid path: $path");
        }
        
        return $fullPath;
    }
    
    /**
     * Recursively delete directory
     */
    private function deleteDirectoryRecursive($dir) {
        if (!is_dir($dir)) {
            return;
        }
        
        $files = array_diff(scandir($dir), ['.', '..']);
        
        foreach ($files as $file) {
            $path = $dir . '/' . $file;
            is_dir($path) ? $this->deleteDirectoryRecursive($path) : unlink($path);
        }
        
        rmdir($dir);
    }
    
    /**
     * Recursively search for files
     */
    private function searchRecursive($dir, $searchTerm, $relativePath, &$results) {
        if (!is_dir($dir)) {
            return;
        }
        
        $files = scandir($dir);
        
        foreach ($files as $file) {
            if ($file === '.' || $file === '..') {
                continue;
            }
            
            $fullPath = $dir . '/' . $file;
            $relPath = $relativePath ? $relativePath . '/' . $file : $file;
            
            if (stripos($file, $searchTerm) !== false) {
                $results[] = [
                    'name' => $file,
                    'path' => $relPath,
                    'type' => is_dir($fullPath) ? 'directory' : 'file',
                    'size' => is_file($fullPath) ? filesize($fullPath) : 0,
                    'modified' => filemtime($fullPath)
                ];
            }
            
            if (is_dir($fullPath) && count($results) < 100) {
                $this->searchRecursive($fullPath, $searchTerm, $relPath, $results);
            }
        }
    }
    
    /**
     * Calculate directory size recursively
     */
    private function calculateDirectorySize($dir, &$size) {
        if (!is_dir($dir)) {
            return;
        }
        
        $files = scandir($dir);
        
        foreach ($files as $file) {
            if ($file === '.' || $file === '..') {
                continue;
            }
            
            $path = $dir . '/' . $file;
            
            if (is_file($path)) {
                $size += filesize($path);
            } elseif (is_dir($path)) {
                $this->calculateDirectorySize($path, $size);
            }
        }
    }
    
    /**
     * Format file size to human readable
     */
    public static function formatSize($bytes) {
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];
        $bytes = max($bytes, 0);
        $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
        $pow = min($pow, count($units) - 1);
        $bytes /= pow(1024, $pow);
        
        return round($bytes, 2) . ' ' . $units[$pow];
    }
}
