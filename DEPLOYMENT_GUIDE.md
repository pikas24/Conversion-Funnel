# Deployment Guide - Conversion Funnel Backend System

Panduan lengkap untuk deployment sistem Conversion Funnel - Agency Nexus

## Overview

Sistem ini terdiri dari:

```
Frontend (React + Tailwind)
        ↓
Backend API (Supabase Edge Function + Hono)
        ↓
Database (Airtable)
        ↓
Automation (Telegram + Email)
```

## Phase 1 - Backend Implementation ✅

Backend system telah diimplementasikan dengan komponen:

### 1. Layered Architecture

```
/supabase/functions/server/
├── index.tsx                    # API Layer
├── booking.validator.tsx        # Validation Layer
├── booking.service.tsx          # Service Layer
├── lead.repository.tsx          # Repository Layer
├── appointment.repository.tsx   # Repository Layer
├── booking.trigger.tsx          # Trigger Layer
├── airtable.config.tsx          # Database Config
└── validation.utils.tsx         # Utilities
```

### 2. API Endpoints

- `GET /make-server-1a9814d3/health` - Health check
- `POST /make-server-1a9814d3/api/bookings` - Create booking

### 3. Features Implemented

✅ Input validation (phone, email, date, time, service)
✅ Lead creation with auto-scoring
✅ Appointment creation
✅ Airtable integration
✅ Telegram notification
✅ Email notification (Resend)
✅ Error handling & logging
✅ Frontend integration ready

## Pre-Deployment Checklist

### ✅ Environment Variables

Pastikan semua environment variables sudah diset di Supabase:

```bash
# Airtable
AIRTABLE_API_KEY=patXXXXXXXXXXXXXX
AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX
AIRTABLE_LEADS_TABLE_ID=Leads
AIRTABLE_BOOKINGS_TABLE_ID=Appointments

# Telegram
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
TELEGRAM_ADMIN_CHAT_ID=-1001234567890

# Email (Resend)
RESEND_API_KEY=re_XXXXXXXXXXXXXXXXXXXXXXXX
RESEND_TO_EMAIL=admin@clinic.com

# Supabase (auto-configured)
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=xxxxx
SUPABASE_SERVICE_ROLE_KEY=xxxxx
```

### ✅ External Services Setup

1. **Airtable** - Ikuti [AIRTABLE_SETUP.md](./AIRTABLE_SETUP.md)
   - Create base
   - Setup Leads table
   - Setup Appointments table
   - Get API credentials

2. **Telegram** - Ikuti [TELEGRAM_SETUP.md](./TELEGRAM_SETUP.md)
   - Create bot via BotFather
   - Setup admin group
   - Get Chat ID
   - Test notification

3. **Resend** - Setup email service
   - Sign up at [resend.com](https://resend.com)
   - Get API key
   - Verify domain (optional, for production)
   - Test email sending

## Deployment Steps

### Step 1: Verify Backend Files

Pastikan semua file backend ada:

```bash
ls /supabase/functions/server/
# Expected files:
# - index.tsx
# - booking.validator.tsx
# - booking.service.tsx
# - lead.repository.tsx
# - appointment.repository.tsx
# - booking.trigger.tsx
# - airtable.config.tsx
# - validation.utils.tsx
# - kv_store.tsx (pre-existing)
```

### Step 2: Test API Locally (Optional)

Jika menggunakan Supabase CLI:

```bash
supabase functions serve make-server-1a9814d3
```

Test dengan curl:

```bash
curl -X POST http://localhost:54321/functions/v1/make-server-1a9814d3/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Test User",
    "phone_number": "+6281234567890",
    "email": "test@example.com",
    "service_interest": "Laser Treatment",
    "preferred_date": "2026-04-10",
    "preferred_time": "10:00"
  }'
```

### Step 3: Deploy to Production

Backend sudah otomatis ter-deploy di Supabase Edge Functions.

Akses API production di:
```
https://[PROJECT_ID].supabase.co/functions/v1/make-server-1a9814d3/api/bookings
```

### Step 4: Test Production API

Test health check:

```bash
curl https://[PROJECT_ID].supabase.co/functions/v1/make-server-1a9814d3/health \
  -H "Authorization: Bearer [ANON_KEY]"
```

Expected response:
```json
{
  "status": "ok"
}
```

Test booking endpoint:

```bash
curl -X POST https://[PROJECT_ID].supabase.co/functions/v1/make-server-1a9814d3/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer [ANON_KEY]" \
  -d '{
    "full_name": "Siti Rahma",
    "phone_number": "+6281234567890",
    "email": "siti@example.com",
    "service_interest": "Laser Treatment",
    "preferred_date": "2026-04-10",
    "preferred_time": "10:00"
  }'
```

Expected response:
```json
{
  "status": "success",
  "booking_id": "recXXXXXXXXXXXXXX"
}
```

### Step 5: Verify Data Flow

Setelah test booking berhasil, verifikasi:

1. **Airtable**
   - ✅ Lead baru muncul di Leads table
   - ✅ Appointment baru muncul di Appointments table
   - ✅ Link antara Lead dan Appointment terbuat

2. **Telegram**
   - ✅ Notifikasi diterima di admin group
   - ✅ Format pesan sesuai
   - ✅ Data lengkap (nama, service, tanggal, dll)

3. **Email**
   - ✅ Email diterima admin
   - ✅ HTML formatting benar
   - ✅ Data lengkap

### Step 6: Frontend Integration

Frontend sudah siap di `/src/app/App.tsx` dengan:
- Booking form component
- API integration
- Error handling
- Toast notifications

Test melalui UI:
1. Buka aplikasi di browser
2. Isi form booking
3. Submit
4. Verifikasi toast success
5. Cek data di Airtable
6. Cek notifikasi di Telegram & Email

## Monitoring & Logging

### View Logs

Di Supabase Dashboard:
1. Go to **Functions**
2. Select **make-server-1a9814d3**
3. Click **Logs** tab
4. View real-time logs

### Log Messages

System logs mencakup:
- ✅ Request received
- ✅ Validation status
- ✅ Lead creation
- ✅ Appointment creation
- ✅ Notification status
- ❌ Error details (jika ada)

### Important Log Patterns

Success:
```
=== Booking API Request Received ===
Request payload: {...}
Validation passed, processing booking...
Creating lead in Airtable: {...}
Lead created with ID: recXXX
Creating appointment in Airtable: {...}
Appointment created with ID: recYYY
Triggering booking_created event automation
Telegram notification sent successfully
Email notification sent successfully
Booking processed successfully: recYYY
```

Validation Error:
```
=== Booking API Request Received ===
Request payload: {...}
Validation failed: [...]
```

## Troubleshooting

### Problem: API returns 500 error

**Check:**
1. Supabase logs for error details
2. Environment variables are set correctly
3. External API credentials are valid

**Common causes:**
- Airtable API key expired
- Telegram bot token invalid
- Email service down

### Problem: Data not saved to Airtable

**Check:**
1. AIRTABLE_API_KEY has write permission
2. Table IDs are correct (case-sensitive)
3. Field names match exactly

**Debug:**
```bash
# Check Airtable API directly
curl https://api.airtable.com/v0/[BASE_ID]/[TABLE_ID] \
  -H "Authorization: Bearer [API_KEY]"
```

### Problem: Telegram notification not received

**Check:**
1. Bot is member of group
2. Bot has "Post Messages" permission
3. Chat ID is correct (including minus sign for groups)

**Debug:**
Test notification manually (see TELEGRAM_SETUP.md)

### Problem: Email not received

**Check:**
1. Resend API key valid
2. Recipient email correct
3. Check spam folder
4. Verify domain (for production)

**Debug:**
Check Resend dashboard for delivery status

## Security Considerations

### ⚠️ IMPORTANT

1. **Never commit secrets to code**
   - Use environment variables only
   - Don't hardcode API keys

2. **API Rate Limiting**
   - Airtable: 5 requests/second
   - Telegram: 30 messages/second
   - Resend: depends on plan

3. **Data Privacy**
   - System handles PII (personal data)
   - Ensure GDPR/local compliance
   - Use secure connections only (HTTPS)
   - Restrict access to admin group

4. **Input Validation**
   - ✅ Phone number format enforced
   - ✅ Email validation
   - ✅ Date/time validation
   - ✅ Service whitelist

## Performance Optimization

### Current Implementation

- Notifications sent async (non-blocking)
- Lead score calculated in-memory
- Single database round-trip per entity
- CORS enabled for frontend

### Scaling Considerations

For high traffic (>100 bookings/hour):
1. Consider adding queue system
2. Batch notifications
3. Add caching layer
4. Monitor Airtable API limits

## Maintenance

### Regular Tasks

**Daily:**
- Monitor booking success rate
- Check notification delivery
- Review error logs

**Weekly:**
- Verify Airtable data integrity
- Check lead score distribution
- Review conversion rates

**Monthly:**
- Rotate API keys (security best practice)
- Update service catalog if needed
- Review and optimize performance

## Next Steps - Phase 2

Backend Phase 1 selesai ✅

Phase 2 - Frontend Development akan mencakup:
- Complete landing page design
- Multi-step booking form
- Service showcase pages
- Testimonials section
- Before/after gallery
- FAQ section
- Mobile optimization
- Analytics integration

## Support & Documentation

- Backend API: [/supabase/functions/server/README.md](./supabase/functions/server/README.md)
- Airtable Setup: [AIRTABLE_SETUP.md](./AIRTABLE_SETUP.md)
- Telegram Setup: [TELEGRAM_SETUP.md](./TELEGRAM_SETUP.md)
- Phase 1 Spec: [/src/imports/#_Phase_1_Backend-First_Developme.txt](./src/imports/#_Phase_1_Backend-First_Developme.txt)

## Conclusion

✅ **Phase 1 - Backend System COMPLETE**

System yang sudah berfungsi:
- RESTful API endpoint
- Data validation layer
- Lead management & scoring
- Appointment booking
- Database integration (Airtable)
- Real-time notifications (Telegram + Email)
- Error handling & logging
- Frontend integration ready

Sistem siap digunakan untuk production dengan catatan:
1. Setup semua external services sesuai panduan
2. Verify environment variables
3. Test end-to-end flow
4. Monitor logs untuk errors

**Backend architecture solid dan siap untuk Phase 2 - Frontend Development!** 🚀
