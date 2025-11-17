# MATHWA API Documentation

Base URL: `https://mathwa-api.workers.dev` (Production)

## Authentication

Most admin endpoints require JWT authentication via Bearer token.

```
Authorization: Bearer <your_jwt_token>
```

## Public Endpoints

### Universities

#### GET /api/universities
Get all universities with optional filters.

**Query Parameters:**
- `country` (optional): Filter by country
- `city` (optional): Filter by city

**Response:**
```json
{
  "universities": [
    {
      "id": "uuid",
      "name": "Kyrgyz State University",
      "country": "Kyrgyzstan",
      "city": "Bishkek",
      "description": "...",
      "ranking": 1,
      "tuitionFee": "5000.00",
      "imageUrl": "https://...",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### GET /api/universities/:id
Get single university with programs and gallery.

**Response:**
```json
{
  "university": {
    "id": "uuid",
    "name": "...",
    "programs": [...],
    "gallery": [...]
  }
}
```

### Programs

#### GET /api/programs
Get all programs.

**Query Parameters:**
- `universityId` (optional): Filter by university

**Response:**
```json
{
  "programs": [
    {
      "id": "uuid",
      "universityId": "uuid",
      "name": "Computer Science",
      "duration": "4 years",
      "fee": "6000.00",
      "eligibility": "High school diploma",
      "description": "..."
    }
  ]
}
```

#### GET /api/programs/:id
Get single program details.

### Gallery

#### GET /api/gallery
Get all gallery images.

**Query Parameters:**
- `universityId` (optional): Filter by university

### Content Blocks

#### GET /api/content
Get all content blocks.

**Query Parameters:**
- `key` (optional): Get specific content by key (returns single object)

### Prices

#### GET /api/prices
Get price settings.

**Response:**
```json
{
  "prices": {
    "id": "uuid",
    "consultationFee": "100.00",
    "serviceCharge": "200.00",
    "applicationFee": "50.00"
  }
}
```

### Messages (Contact Form)

#### POST /api/messages
Submit contact form.

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "message": "I want to apply..."
}
```

## Authentication Endpoints

### POST /api/auth/login
Login and get JWT token.

**Body:**
```json
{
  "email": "admin@mathwa.kg",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": { "id": "...", "email": "...", "role": "ADMIN" },
  "session": { ... },
  "token": "eyJhbGci..."
}
```

### GET /api/auth/verify
Verify JWT token (requires auth).

### POST /api/auth/logout
Logout (revoke session).

## Admin Endpoints (Auth Required)

All admin endpoints require `Authorization: Bearer <token>` header and ADMIN or EDITOR role.

### Universities Management

#### POST /api/universities
Create university.

**Body:**
```json
{
  "name": "University Name",
  "country": "Country",
  "city": "City",
  "description": "...",
  "ranking": 1,
  "tuitionFee": "5000",
  "imageUrl": "https://..."
}
```

#### PUT /api/universities/:id
Update university.

#### DELETE /api/universities/:id
Delete university.

### Programs Management

#### POST /api/programs
Create program.

**Body:**
```json
{
  "universityId": "uuid",
  "name": "Program Name",
  "duration": "4 years",
  "fee": "6000",
  "eligibility": "...",
  "description": "..."
}
```

#### PUT /api/programs/:id
Update program.

#### DELETE /api/programs/:id
Delete program.

### Applications Management

#### GET /api/applications
Get all applications (admin only).

**Query Parameters:**
- `status` (optional): PENDING, APPROVED, REJECTED

**Response:**
```json
{
  "applications": [
    {
      "id": "uuid",
      "userId": "uuid",
      "programId": "uuid",
      "universityId": "uuid",
      "status": "PENDING",
      "documents": ["url1", "url2"],
      "notes": "...",
      "user": { "name": "...", "email": "..." },
      "program": { "name": "..." },
      "university": { "name": "..." }
    }
  ]
}
```

#### PATCH /api/applications/:id
Update application status.

**Body:**
```json
{
  "status": "APPROVED",
  "notes": "Approved after review"
}
```

### Messages Management

#### GET /api/messages
Get all messages (admin only).

**Query Parameters:**
- `isRead` (optional): true/false

#### PATCH /api/messages/:id
Mark message as read.

**Body:**
```json
{
  "isRead": true
}
```

#### DELETE /api/messages/:id
Delete message.

### Gallery Management

#### POST /api/gallery
Add gallery image.

**Body:**
```json
{
  "imageUrl": "https://...",
  "title": "Image Title",
  "universityId": "uuid" // optional
}
```

#### DELETE /api/gallery/:id
Delete gallery image.

### Content Management

#### POST /api/content
Create content block.

#### PUT /api/content/:id
Update content block.

#### DELETE /api/content/:id
Delete content block.

### Prices Management

#### PUT /api/prices/:id
Update price settings.

## Error Responses

All endpoints return errors in this format:

```json
{
  "error": "Error message"
}
```

Common status codes:
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error
