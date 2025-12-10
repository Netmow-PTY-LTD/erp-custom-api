#!/bin/bash

# Staff Module
cat > module_docs/staff_module.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Staff Module Documentation</title>
    <script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>
    <style>
        body { font-family: 'Segoe UI', sans-serif; background: linear-gradient(135deg, #ffd89b 0%, #19547b 100%); margin: 0; padding: 20px; color: #333; }
        .container { max-width: 1200px; margin: 0 auto; }
        .header { background: white; border-radius: 12px; padding: 30px; margin-bottom: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); }
        .header h1 { margin: 0 0 10px 0; color: #ffd89b; }
        .card { background: white; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); margin-bottom: 30px; padding: 30px; }
        .card h2 { margin-top: 0; color: #ffd89b; border-bottom: 3px solid #ffd89b; padding-bottom: 15px; margin-bottom: 25px; }
        .route-item { background: #f8f9fa; border-left: 4px solid #ffd89b; padding: 15px 20px; margin-bottom: 15px; border-radius: 6px; }
        .route-item h3 { margin: 0 0 10px 0; font-size: 18px; }
        .route-method { display: inline-block; padding: 4px 12px; border-radius: 4px; font-weight: bold; font-size: 12px; margin-right: 10px; }
        .method-get { background: #28a745; color: white; }
        .method-post { background: #007bff; color: white; }
        .method-put { background: #ffc107; color: #333; }
        .method-delete { background: #dc3545; color: white; }
        .route-path { font-family: 'Courier New', monospace; color: #ffd89b; font-weight: bold; }
        .route-desc { margin: 10px 0 0 0; color: #666; }
        .mermaid { display: flex; justify-content: center; background: #f8f9fa; padding: 20px; border-radius: 8px; }
        .back-link { display: inline-block; padding: 10px 20px; background: #ffd89b; color: #333; text-decoration: none; border-radius: 6px; margin-bottom: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <a href="/module-docs" class="back-link">← Back to Module Index</a>
        <div class="header">
            <h1>👔 Staff Module</h1>
            <p>Employee management and HR records</p>
        </div>
        <div class="card">
            <h2>📋 API Routes</h2>
            <div class="route-item">
                <h3><span class="route-method method-get">GET</span><span class="route-path">/api/staffs</span></h3>
                <p class="route-desc">List all staff members with pagination.</p>
            </div>
            <div class="route-item">
                <h3><span class="route-method method-post">POST</span><span class="route-path">/api/staffs</span></h3>
                <p class="route-desc">Add new staff member.</p>
            </div>
            <div class="route-item">
                <h3><span class="route-method method-get">GET</span><span class="route-path">/api/staffs/:id</span></h3>
                <p class="route-desc">Get staff details.</p>
            </div>
            <div class="route-item">
                <h3><span class="route-method method-put">PUT</span><span class="route-path">/api/staffs/:id</span></h3>
                <p class="route-desc">Update staff information.</p>
            </div>
            <div class="route-item">
                <h3><span class="route-method method-delete">DELETE</span><span class="route-path">/api/staffs/:id</span></h3>
                <p class="route-desc">Remove staff member.</p>
            </div>
        </div>
        <div class="card">
            <h2>🗄️ Database Schema (ER Diagram)</h2>
            <div class="mermaid">
erDiagram
    STAFFS {
        int id PK
        string first_name
        string last_name
        string email UK
        string phone
        string position
        string department
        date hire_date
        decimal salary
        string address
        enum status
        datetime created_at
        datetime updated_at
    }
    DEPARTMENTS {
        int id PK
        string name UK
        text description
    }
    STAFFS }|--|| DEPARTMENTS : "belongs to"
            </div>
        </div>
        <div class="card">
            <h2>📊 Tables Used</h2>
            <ul>
                <li><strong>staffs</strong> - Employee master data</li>
                <li><strong>departments</strong> - Department information</li>
            </ul>
        </div>
    </div>
    <script>mermaid.initialize({ startOnLoad: true, theme: 'default' });</script>
</body>
</html>
EOF

echo "Created staff_module.html"

# Continue with other modules...
