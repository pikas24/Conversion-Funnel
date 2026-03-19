# Conversion Funnel Backend API

Backend system untuk Conversion Funnel - Agency Nexus

## Architecture

Backend menggunakan **Layered Architecture**:

```
API Layer (index.tsx)
    ↓
Validation Layer (booking.validator.tsx)
    ↓
Service Layer (booking.service.tsx)
    ↓
Repository Layer (lead.repository.tsx, appointment.repository.tsx)
    ↓
Database (Airtable)
    ↓
Trigger Layer (booking.trigger.tsx)
```

## File Structure

```
/supabase/functions/server/
├── index.tsx                    # API Layer - HTTP endpoints
├── booking.validator.tsx        # Validation Layer
├── booking.service.tsx          # Service Layer - business logic
├── lead.repository.tsx          # Repository Layer - Lead operations
├── appointment.repository.tsx   # Repository Layer - Appointment operations
├── booking.trigger.tsx          # Trigger Layer - automation & notifications
├── airtable.config.tsx          # Airtable client configuration
├── validation.utils.tsx         # Validation utilities
└── kv_store.tsx                 # Key-Value store utility
```

## API Endpoints

### Health Check

**Endpoint:** `GET /make-server-1a9814d3/health`

**Response:**
```json
{
  "status": "ok"
}
```

### Create Booking

**Endpoint:** `POST /make-server-1a9814d3/api/bookings`

**Request Body:**
```json
{
  "full_name": "Siti Rahma",
  "phone_number": "+6281234567890",
  "email": "siti@email.com",
  "service_interest": "Laser Treatment",
  "preferred_date": "2026-04-10",
  "preferred_time": "10:00"
}
```

**Success Response (200):**
```json
{
  "status": "success",
  "booking_id": "recABC123XYZ"
}
```

**Validation Error Response (422):**
```json
{
  "status": "error",
  "error_code": "VALIDATION_ERROR",
  "errors": [
    {
      "field": "phone_number",
      "message": "Phone number must start with +62"
    }
  ]
}
```

**Server Error Response (500):**
```json
{
  "status": "error",
  "error_code": "INTERNAL_SERVER_ERROR",
  "message": "Unexpected server error: [details]"
}
```

## Validation Rules

### Phone Number
- Must start with `+62`
- Must have 10-15 digits after `+62`
- Only numeric characters allowed

### Email
- Must be valid email format (RFC compliant)

### Full Name
- Minimum 3 characters

### Service Interest
Valid options:
- Laser Treatment
- Facial Brightening
- Acne Treatment
- Skin Rejuvenation
- Anti-Aging Treatment
- Chemical Peeling

### Preferred Date
- Must not be in the past
- Format: `YYYY-MM-DD`

### Preferred Time
- Format: `HH:mm` (24-hour format)
- Example: `10:00`, `14:30`

## Automation

When a booking is created, the system automatically triggers:

1. **Telegram Notification** - sent to admin group
2. **Email Notification** - sent to clinic admin/owner

### Telegram Message Format

```
🔔 BOOKING BARU – BELUM DIKONTAK

👤 Nama: Siti Rahma
💆 Treatment: Laser Treatment
📅 Tanggal: 10 April 2026
🕐 Jam: 10:00
📱 Phone: +6281234567890
📧 Email: siti@email.com

🆔 Booking ID: recABC123XYZ
```

### Email Format

HTML email with:
- Patient details
- Appointment information
- Follow-up instructions

## Database Schema

### Leads Table (Airtable)

| Field            | Type              | Description                |
|------------------|-------------------|----------------------------|
| full_name        | Single line text  | Patient name               |
| phone_number     | Phone number      | WhatsApp number            |
| email            | Email             | Email address              |
| service_interest | Single line text  | Interested service         |
| status           | Single Select     | New/Contacted/Qualified... |
| source           | Single Select     | landing_page/referral...   |
| lead_score       | Number            | 0-100 quality score        |
| created_at       | Date (with time)  | Creation timestamp         |

### Appointments Table (Airtable)

| Field               | Type              | Description              |
|---------------------|-------------------|--------------------------|
| requested_service   | Single line text  | Booked service           |
| lead_id             | Link to Leads     | Reference to lead        |
| preferred_date      | Date              | Appointment date         |
| preferred_time      | Single line text  | Appointment time (HH:mm) |
| appointment_status  | Single Select     | Pending/Confirmed...     |
| created_at          | Date (with time)  | Creation timestamp       |

## Environment Variables Required

```
AIRTABLE_API_KEY=your_airtable_api_key
AIRTABLE_BASE_ID=your_base_id
AIRTABLE_LEADS_TABLE_ID=your_leads_table_id
AIRTABLE_BOOKINGS_TABLE_ID=your_appointments_table_id
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_ADMIN_CHAT_ID=your_chat_id
RESEND_API_KEY=your_resend_api_key
RESEND_TO_EMAIL=admin@clinic.com
```

## Lead Scoring System

Leads are automatically scored 0-100 based on:

- Base score: 50 points
- Email provided: +10 points
- Valid phone number: +10 points
- High-value service: +20 points
- Landing page source: +10 points

Score categories:
- 80-100: HOT lead
- 50-79: WARM lead
- 0-49: COLD lead

## Workflow

```
User submits form
      ↓
API receives request
      ↓
Validate input
      ↓
Create Lead in Airtable
      ↓
Calculate lead score
      ↓
Create Appointment in Airtable
      ↓
Trigger booking_created event
      ↓
Send Telegram notification (async)
      ↓
Send Email notification (async)
      ↓
Return success response
```

## Error Handling

- All errors are logged with detailed context
- Validation errors return 422 status
- Server errors return 500 status
- Notification failures don't block booking success
- All external API calls include error handling

## Testing

Test the API with curl:

```bash
curl -X POST https://your-project.supabase.co/functions/v1/make-server-1a9814d3/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -d '{
    "full_name": "Siti Rahma",
    "phone_number": "+6281234567890",
    "email": "siti@email.com",
    "service_interest": "Laser Treatment",
    "preferred_date": "2026-04-10",
    "preferred_time": "10:00"
  }'
```
