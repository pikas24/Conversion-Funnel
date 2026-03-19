# Testing Guide - Conversion Funnel Integration

Panduan untuk menguji semua integrasi sistem: Supabase, Airtable, Telegram, dan Resend (Email)

## 🎯 Quick Start

Aplikasi sekarang memiliki **Test Dashboard** yang bisa Anda akses langsung di browser.

### Tab "Test Integrations"

Dashboard ini menyediakan button untuk test setiap service secara terpisah:

1. **Environment Variables** - Check apakah semua secrets sudah dikonfigurasi
2. **Airtable** - Test create Lead dan Appointment
3. **Telegram** - Test kirim notifikasi ke admin group
4. **Email** - Test kirim email via Resend
5. **Full Integration Test** - Test semua service sekaligus

## 📋 Pre-Test Checklist

Pastikan semua secrets sudah diisi di **Supabase Dashboard → Edge Functions → Secrets**:

### ✅ Airtable Secrets
```
AIRTABLE_API_KEY=patXXXXXXXXXXXXXX
AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX
AIRTABLE_LEADS_TABLE_ID=Leads
AIRTABLE_BOOKINGS_TABLE_ID=Appointments
```

### ✅ Telegram Secrets
```
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
TELEGRAM_ADMIN_CHAT_ID=-1001234567890
```

### ✅ Email (Resend) Secrets
```
RESEND_API_KEY=re_XXXXXXXXXXXXXXXX
RESEND_TO_EMAIL=admin@clinic.com
```

### ✅ Supabase Secrets (Auto-configured)
```
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=xxxxx
SUPABASE_SERVICE_ROLE_KEY=xxxxx
```

## 🧪 Testing Steps

### Step 1: Check Environment Variables

1. Buka aplikasi di browser
2. Klik tab **"Test Integrations"**
3. Klik button **"Test"** pada bagian **Environment Variables**
4. Hasil akan menampilkan status semua secrets (✅ configured / ❌ missing)

**Expected Result:**
```json
{
  "status": "success",
  "message": "All environment variables configured",
  "variables": {
    "airtable": { ... all true },
    "telegram": { ... all true },
    "email": { ... all true }
  }
}
```

### Step 2: Test Airtable

1. Klik button **"Test"** pada bagian **Airtable Database**
2. System akan create test Lead dan Appointment di Airtable
3. Check response untuk Lead ID dan Appointment ID

**Expected Result:**
- ✅ Status: Success
- Lead ID: `recXXXXXXXXXXXXXX`
- Appointment ID: `recYYYYYYYYYYYYY`

**Verify in Airtable:**
1. Login ke Airtable
2. Buka base Anda
3. Check tabel **Leads** → ada record baru dengan nama `TEST Lead - [timestamp]`
4. Check tabel **Appointments** → ada record baru yang linked ke Lead

### Step 3: Test Telegram

1. Klik button **"Test"** pada bagian **Telegram Notification**
2. System akan kirim test message ke Telegram admin group

**Expected Result:**
- ✅ Status: Success
- Message: "Test notification sent successfully"

**Verify in Telegram:**
1. Buka Telegram app
2. Check admin group Anda
3. Anda akan menerima pesan test dengan format booking notification

### Step 4: Test Email (Resend)

1. Klik button **"Test"** pada bagian **Email Notification**
2. System akan kirim test email via Resend

**Expected Result:**
- ✅ Status: Success
- Message: "Test email sent successfully"

**Verify in Email:**
1. Buka email inbox (sesuai RESEND_TO_EMAIL)
2. Check inbox untuk email dari "Agency Nexus"
3. Subject: "🔔 Booking Baru: TEST User - Email Test - Laser Treatment"
4. Email berisi detail booking dengan HTML formatting

### Step 5: Run Full Integration Test

1. Klik button **"Run Full Test"** di bagian bawah
2. System akan:
   - Create real Lead di Airtable
   - Create real Appointment di Airtable
   - Send Telegram notification
   - Send Email notification

**Expected Result:**
```
✅ All integrations working!

Results:
- Airtable: ✅ Lead: recXXX | Appointment: recYYY
- Telegram: ✅ Sent
- Email: ✅ Sent
```

**Verify:**
1. ✅ Airtable: Record `FULL TEST - [timestamp]` muncul
2. ✅ Telegram: Notifikasi muncul di group
3. ✅ Email: Email diterima di inbox

## 🎯 Test Booking Form

Setelah semua integrasi berhasil, test booking form:

1. Klik tab **"Booking Form"**
2. Isi form dengan data test:
   - **Full Name:** Siti Rahma
   - **WhatsApp:** +6281234567890
   - **Email:** siti@example.com
   - **Service:** Laser Treatment
   - **Date:** Pilih tanggal future
   - **Time:** 10:00
3. Klik **"Book Appointment"**

**Expected Result:**
- ✅ Toast notification: "Booking berhasil dibuat!"
- ✅ Booking ID ditampilkan
- ✅ Form di-reset

**Verify End-to-End:**
1. ✅ Airtable Leads: Record baru dengan nama "Siti Rahma"
2. ✅ Airtable Appointments: Record baru linked ke lead
3. ✅ Telegram: Notifikasi dengan data Siti Rahma
4. ✅ Email: Email dengan detail booking Siti Rahma

## 🔍 Test via API (Optional)

### Test Health Endpoint

```bash
curl https://[PROJECT_ID].supabase.co/functions/v1/make-server-1a9814d3/health \
  -H "Authorization: Bearer [ANON_KEY]"
```

**Expected:**
```json
{"status":"ok"}
```

### Test Environment Check

```bash
curl https://[PROJECT_ID].supabase.co/functions/v1/make-server-1a9814d3/test/env \
  -H "Authorization: Bearer [ANON_KEY]"
```

### Test Airtable

```bash
curl https://[PROJECT_ID].supabase.co/functions/v1/make-server-1a9814d3/test/airtable \
  -H "Authorization: Bearer [ANON_KEY]"
```

### Test Telegram

```bash
curl https://[PROJECT_ID].supabase.co/functions/v1/make-server-1a9814d3/test/telegram \
  -H "Authorization: Bearer [ANON_KEY]"
```

### Test Email

```bash
curl https://[PROJECT_ID].supabase.co/functions/v1/make-server-1a9814d3/test/email \
  -H "Authorization: Bearer [ANON_KEY]"
```

### Test Full Integration

```bash
curl https://[PROJECT_ID].supabase.co/functions/v1/make-server-1a9814d3/test/all \
  -H "Authorization: Bearer [ANON_KEY]"
```

### Test Booking Endpoint

```bash
curl -X POST https://[PROJECT_ID].supabase.co/functions/v1/make-server-1a9814d3/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer [ANON_KEY]" \
  -d '{
    "full_name": "Test via API",
    "phone_number": "+6281234567890",
    "email": "api@test.com",
    "service_interest": "Facial Brightening",
    "preferred_date": "2026-04-15",
    "preferred_time": "14:30"
  }'
```

## 🐛 Troubleshooting

### ❌ Environment Variables Check Failed

**Problem:** Some variables show ❌

**Solution:**
1. Go to Supabase Dashboard
2. Navigate to Edge Functions → Secrets
3. Add missing secrets
4. Restart/redeploy function if needed

### ❌ Airtable Test Failed

**Common Issues:**

1. **"Could not find table"**
   - Verify `AIRTABLE_LEADS_TABLE_ID` and `AIRTABLE_BOOKINGS_TABLE_ID`
   - Table name harus exact match (case-sensitive)
   - Default: `Leads` dan `Appointments`

2. **"Unauthorized"**
   - Verify `AIRTABLE_API_KEY` masih valid
   - Check token permissions (need read + write)

3. **"Invalid field name"**
   - Verify field names di Airtable match schema
   - Follow [AIRTABLE_SETUP.md](./AIRTABLE_SETUP.md)

### ❌ Telegram Test Failed

**Common Issues:**

1. **"Unauthorized"**
   - `TELEGRAM_BOT_TOKEN` salah
   - Get new token from @BotFather

2. **"Chat not found"**
   - Bot belum di-add ke group
   - `TELEGRAM_ADMIN_CHAT_ID` salah
   - Group ID harus include tanda minus: `-1001234567890`

3. **"Bot was blocked"**
   - User blocked bot (untuk personal chat)
   - Klik /start di bot

### ❌ Email Test Failed

**Common Issues:**

1. **"Unauthorized"**
   - `RESEND_API_KEY` salah atau expired
   - Get new key from Resend dashboard

2. **"Invalid recipient"**
   - `RESEND_TO_EMAIL` format salah
   - Verify email address valid

3. **Email not received**
   - Check spam folder
   - For production, verify domain in Resend
   - Free tier: only send to verified emails

### ❌ Full Test Partial Success

If some services pass but others fail:

1. Check individual test results
2. Fix failed services one by one
3. Re-run full test after fixes

## 📊 Monitoring

### View Backend Logs

1. Go to Supabase Dashboard
2. Functions → make-server-1a9814d3
3. Logs tab
4. Set real-time updates

**What to look for:**
- `✅` Success messages
- `❌` Error messages with details
- Request/response data
- Integration status

### Airtable Dashboard

Monitor records in real-time:
- Leads table → check new entries
- Appointments table → check linked records
- Filter by created_at for recent tests

### Telegram Admin Group

All booking notifications appear here in real-time.

### Email Inbox

Check admin email for booking notifications.

## ✅ Success Criteria

System is working correctly when:

- ✅ Environment check shows all variables configured
- ✅ Airtable test creates Lead + Appointment
- ✅ Telegram test sends notification to group
- ✅ Email test sends email to admin
- ✅ Full integration test passes all services
- ✅ Booking form creates real booking with notifications
- ✅ Data appears in Airtable correctly
- ✅ Lead score calculated correctly
- ✅ Appointments linked to Leads properly

## 🎉 Next Steps

After all tests pass:

1. ✅ **Backend System Verified** - All integrations working
2. 📝 **Document any custom configurations** made
3. 🚀 **Ready for Production Use** or Phase 2 Frontend Development
4. 📊 **Monitor real bookings** as they come in
5. 🔧 **Fine-tune notifications** if needed

## 📞 Support

If you encounter issues:

1. Check this guide first
2. Review backend logs in Supabase
3. Verify all setup guides followed:
   - [AIRTABLE_SETUP.md](./AIRTABLE_SETUP.md)
   - [TELEGRAM_SETUP.md](./TELEGRAM_SETUP.md)
   - [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

---

**Happy Testing! 🧪**

All integrations ready for testing through the UI dashboard.
