# Settings Module

## Base Mapping
- **Module Name**: Settings
- **Base Path**: `/api/settings`

## Routes

### 1. Get Company Profile
- **Method**: `GET`
- **Path**: `/company/profile`
- **Description**: Get company profile information
- **Sample Response**:
```json
{
  "status": true,
  "data": {
    "id": 1,
    "company_name": "ABC Corporation",
    "email": "info@abccorp.com",
    "phone": "+1234567890",
    "address": "123 Business Street",
    "city": "New York",
    "country": "USA",
    "tax_id": "TAX123456",
    "logo_url": "/uploads/logo.png",
    "website": "https://abccorp.com"
  }
}
```

### 2. Update Company Profile
- **Method**: `PUT`
- **Path**: `/company/profile`
- **Description**: Update company profile information
- **Sample Request**:
```json
{
  "company_name": "ABC Corporation Ltd",
  "email": "contact@abccorp.com",
  "phone": "+1234567891",
  "website": "https://www.abccorp.com"
}
```
- **Sample Response**:
```json
{
  "status": true,
  "message": "Company profile updated successfully",
  "data": {
    "id": 1,
    "company_name": "ABC Corporation Ltd",
    "updated_at": "2025-12-02T10:00:00.000Z"
  }
}
```
