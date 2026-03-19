# 🚀 Quick Start Guide

Panduan cepat untuk test sistem Conversion Funnel Backend

## ✅ Yang Sudah Anda Lakukan

- ✅ Setup Supabase Edge Functions
- ✅ Fill in semua secrets (API keys, tokens, dll)
- ✅ Backend system sudah deployed

## 🎯 Langkah Testing (5 Menit)

### 1. Buka Aplikasi

Buka aplikasi di browser Anda.

### 2. Klik Tab "Test Integrations"

Anda akan melihat dashboard dengan 5 test options.

### 3. Test Environment Variables

**Klik button "Test"** di bagian **Environment Variables**

✅ **Expected:** Semua variables menunjukkan ✅
❌ **Jika ada yang ❌:** Secret belum diisi di Supabase

### 4. Test Airtable

**Klik button "Test"** di bagian **Airtable Database**

✅ **Expected:** 
- Status: Success
- Lead ID: recXXXXXXXX
- Appointment ID: recYYYYYYYY

📋 **Verify di Airtable:**
- Login ke Airtable
- Check tabel Leads → ada record baru "TEST Lead"
- Check tabel Appointments → ada record baru

❌ **Jika gagal:** 
- Check AIRTABLE_API_KEY valid
- Check table names exact match (Leads, Appointments)
- Follow [AIRTABLE_SETUP.md](./AIRTABLE_SETUP.md)

### 5. Test Telegram

**Klik button "Test"** di bagian **Telegram Notification**

✅ **Expected:** 
- Status: Success
- Message: "Test notification sent successfully"

📱 **Verify di Telegram:**
- Buka Telegram app
- Check admin group Anda
- Anda akan menerima pesan test

❌ **Jika gagal:**
- Check bot sudah di-add ke group
- Check bot punya permission "Post Messages"
- Chat ID correct (include minus untuk group: -1001234...)
- Follow [TELEGRAM_SETUP.md](./TELEGRAM_SETUP.md)

### 6. Test Email

**Klik button "Test"** di bagian **Email Notification**

✅ **Expected:**
- Status: Success
- Message: "Test email sent successfully"

📧 **Verify di Email:**
- Check inbox (sesuai RESEND_TO_EMAIL)
- Email dari "Agency Nexus"
- Subject: "🔔 Booking Baru: TEST User..."

❌ **Jika gagal:**
- Check RESEND_API_KEY valid
- Check RESEND_TO_EMAIL format correct
- Check spam folder

### 7. Run Full Integration Test

**Klik button "Run Full Test"**

✅ **Expected:**
```
✅ All integrations working!

Results:
- Airtable: ✅ Lead: recXXX | Appointment: recYYY
- Telegram: ✅ Sent
- Email: ✅ Sent
```

🎉 **Jika semua ✅:**
- Backend system WORKING!
- Siap untuk production use
- Lanjut ke test booking form

### 8. Test Booking Form

**Klik tab "Booking Form"**

Isi form:
- Full Name: `Siti Rahma`
- Phone: `+6281234567890`
- Email: `test@example.com`
- Service: `Laser Treatment`
- Date: Pilih tanggal future
- Time: `10:00`

**Klik "Book Appointment"**

✅ **Expected:**
- Toast: "Booking berhasil dibuat!"
- Booking ID ditampilkan

**Verify:**
- Airtable → Record "Siti Rahma" ada
- Telegram → Notifikasi masuk
- Email → Email masuk

## 🎉 Success!

Jika semua test pass, sistem Anda sudah:
- ✅ Connected to Airtable
- ✅ Connected to Telegram
- ✅ Connected to Resend (Email)
- ✅ Ready for production bookings

## 📊 What Happens Next?

Setiap kali ada booking baru:

1. Data masuk ke Airtable (Leads + Appointments)
2. Lead score dihitung otomatis
3. Telegram notification dikirim ke admin
4. Email notification dikirim ke admin
5. Frontend dapat booking_id

## 🔍 Monitoring

**Supabase Logs:**
- Dashboard → Functions → make-server-1a9814d3 → Logs
- Monitor real-time requests

**Airtable:**
- Monitor Leads table untuk lead baru
- Check Appointments table untuk bookings

**Telegram:**
- Admin group menerima notifikasi real-time

**Email:**
- Admin inbox menerima detail booking

## ❌ Troubleshooting Quick Fixes

### Environment Variables gagal
→ Supabase Dashboard → Edge Functions → Secrets → Add missing

### Airtable gagal
→ Verify table names: `Leads` dan `Appointments` (exact match)
→ Check API key permissions (read + write)

### Telegram gagal
→ Add bot ke group
→ Make bot admin dengan "Post Messages" permission
→ Verify Chat ID (must include minus for groups)

### Email gagal
→ Check spam folder
→ Verify API key di Resend dashboard
→ For free tier: only verified emails

## 📖 Full Documentation

- [TESTING_GUIDE.md](./TESTING_GUIDE.md) - Detailed testing guide
- [AIRTABLE_SETUP.md](./AIRTABLE_SETUP.md) - Airtable configuration
- [TELEGRAM_SETUP.md](./TELEGRAM_SETUP.md) - Telegram bot setup
- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Complete deployment
- [README.md](./README.md) - Full documentation

## 🎯 Test Checklist

- [ ] Environment variables test passed
- [ ] Airtable test passed
- [ ] Telegram test passed
- [ ] Email test passed
- [ ] Full integration test passed
- [ ] Booking form test passed
- [ ] Verified in Airtable
- [ ] Verified in Telegram
- [ ] Verified in Email

## ✅ All Tests Passed?

**Congratulations! 🎉**

Your Conversion Funnel Backend System is:
- ✅ Fully operational
- ✅ All integrations connected
- ✅ Ready for production bookings
- ✅ Phase 1 - COMPLETE

---

**Need Help?**

Buka browser console (F12) dan Supabase logs untuk error details.

**Happy Testing! 🧪**
