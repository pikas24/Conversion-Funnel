# Conversion Funnel System - Agency Nexus

Complete 3-page conversion funnel system untuk klinik kecantikan, dibangun dengan arsitektur layered yang modular dan scalable, dilengkapi dengan premium landing page design dan multi-step booking flow.

## 📋 Project Overview

Sistem ini merupakan implementasi **Complete 3-Page Conversion Funnel** dari Conversion Funnel System yang dirancang untuk Agency Nexus. Sistem ini menangani:

- 🎨 **Premium Landing Page** dengan Medical Elite Boutique design
- 📝 **Multi-Step Booking Page** dengan focused conversion UX
- ✅ **Confirmation Page** dengan post-booking guidance
- 💾 Penyimpanan data lead dan appointment ke database
- ✅ Validasi data komprehensif dengan real-time feedback
- 📊 Lead scoring otomatis
- 🔔 Notifikasi real-time ke admin via Telegram
- 📧 Notifikasi email dengan detail booking
- 🏗️ Arsitektur backend yang solid untuk frontend development

## 🎨 Complete Funnel Pages

### 1. Landing Page (Phase 2) ✅
Landing page dengan **Medical Elite Boutique Design** yang:
- ✨ Elegant & premium aesthetic
- 🎯 High-conversion funnel psychology (11 sections)
- 📱 Fully responsive (mobile-first)
- 🎭 Interactive before-after sliders
- 🗣️ Testimonial carousel with auto-slide
- 🎬 Smooth scroll animations
- 💎 Luxury typography system

**[Read full guide →](./LANDING_PAGE_GUIDE.md)**

### 2. Booking Page (Phase 3) ✅ NEW!
**Multi-Step Booking Flow** dengan focused conversion design:
- 📊 4-Step progressive form (Personal Info → Service → Schedule → Confirm)
- 🎯 Step indicator dengan progress bar
- 👨‍⚕️ Doctor reference card (trust & human element)
- 📋 Live booking summary sidebar
- ✅ Real-time validation dengan checkmarks
- 🔐 Security trust signals
- 📱 Mobile-optimized with large touch targets
- 🎬 Smooth step transitions

**Key Features:**
- Linear, focused flow (no distractions)
- Single column layout untuk clarity
- Generous white space
- Professional & calming aesthetic
- Progressive disclosure (one step at a time)

**[Read full guide →](./BOOKING_PAGE_GUIDE.md)**

### 3. Confirmation Page (Phase 3) ✅ NEW!
**Post-Booking Success Page** yang:
- 🎉 Success celebration dengan animation
- 📋 Booking ID display
- 📖 "What happens next" guidance
- 📞 Contact information untuk reschedule
- 🏠 Clear path back to home
- 📅 Add to calendar option

**Design Principles (All Pages):**
- **Restraint** - Tidak ada elemen yang berusaha terlalu keras
- **Visual Hierarchy** - Headline → content → CTA jelas
- **Intentionality** - Setiap elemen memiliki tujuan
- **Trust-Building** - Real photos, credentials, social proof

## 🏛️ Architecture

```
┌─────────��───────────────────────────────────────────────────┐
│                        FRONTEND                              │
│                    (React + Tailwind)                        │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                      API LAYER                               │
│                   (Hono Web Server)                          │
│              POST /api/bookings                              │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   VALIDATION LAYER                           │
│           (Phone, Email, Date, Time, Service)                │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    SERVICE LAYER                             │
│              (Business Logic & Workflow)                     │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  REPOSITORY LAYER                            │
│            (Lead Repo + Appointment Repo)                    │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                      DATABASE                                │
│                     (Airtable)                               │
│                                                              │
│   ┌──────────┐              ┌──────────────┐                │
│   │  Leads   │─────────────▶│ Appointments │                │
│   └──────────┘    1:Many    └──────────────┘                │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   TRIGGER LAYER                              │
│              (Event: booking_created)                        │
│                                                              │
│   ┌────────────────┐        ┌────────────────┐              │
│   │   Telegram     │        │     Email      │              │
│   │  Notification  │        │  Notification  │              │
│   └────────────────┘        └────────────────┘              │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Features

### ✅ Implemented (Phase 1 - Backend)

- **API Endpoint** - RESTful API untuk booking
- **Data Validation** - Validasi komprehensif untuk semua input
- **Lead Management** - Otomatis create lead dengan scoring system
- **Appointment Booking** - Create appointment dengan relasi ke lead
- **Airtable Integration** - Simpan data ke cloud database
- **Telegram Notifications** - Real-time alert ke admin group
- **Email Notifications** - Detailed email dengan HTML formatting
- **Error Handling** - Comprehensive error handling & logging
- **Lead Scoring** - Otomatis calculate lead quality (0-100)

### 🔄 Workflow

```
User mengisi form booking
        ↓
Frontend submit ke API
        ↓
Backend validate input
        ↓
Create Lead di Airtable (dengan lead score)
        ↓
Create Appointment di Airtable (linked to Lead)
        ↓
Trigger event: booking_created
        ↓
Kirim Telegram notification → Admin Group
        ↓
Kirim Email notification → Admin Email
        ↓
Return booking_id ke frontend
        ↓
Frontend show success message
```

## 📁 Project Structure

```
/
├── src/
│   ├── app/
│   │   ├── App.tsx                      # Main application
│   │   ├── components/
│   │   │   ├── BookingForm.tsx          # Booking form component
│   │   │   └── ui/                      # UI components library
│   │   └── utils/
│   │       └── api.ts                   # API client utilities
│   ├── imports/                         # Documentation files
│   └── styles/                          # Tailwind & theme styles
│
├── supabase/
│   └── functions/
│       └── server/
│           ├── index.tsx                # 🔵 API Layer
│           ├── booking.validator.tsx    # 🟢 Validation Layer
│           ├── booking.service.tsx      # 🟡 Service Layer
│           ├── lead.repository.tsx      # 🟣 Repository Layer
│           ├── appointment.repository.tsx
│           ├── booking.trigger.tsx      # 🔴 Trigger Layer
│           ├── airtable.config.tsx      # Database config
│           ├── validation.utils.tsx     # Validation utilities
│           └── README.md                # Backend API docs
│
├── AIRTABLE_SETUP.md                    # Panduan setup Airtable
├── TELEGRAM_SETUP.md                    # Panduan setup Telegram Bot
├── DEPLOYMENT_GUIDE.md                  # Panduan deployment lengkap
└── README.md                            # This file
```

## 🛠️ Tech Stack

### Frontend
- **React 18.3** - UI framework
- **Tailwind CSS v4** - Styling
- **Radix UI** - Accessible components
- **Sonner** - Toast notifications
- **Lucide React** - Icons

### Backend
- **Supabase Edge Functions** - Serverless backend
- **Hono** - Web framework
- **Deno** - Runtime environment
- **TypeScript** - Type safety

### External Services
- **Airtable** - Cloud database
- **Telegram Bot API** - Notifications
- **Resend** - Email service

## 📦 Installation & Setup

### 1. Clone Project

Project ini sudah ter-setup di Figma Make environment.

### 2. Setup External Services

Ikuti panduan setup untuk setiap service:

1. **Airtable** - [AIRTABLE_SETUP.md](./AIRTABLE_SETUP.md)
   - Buat base baru
   - Setup Leads table
   - Setup Appointments table
   - Dapatkan API credentials

2. **Telegram Bot** - [TELEGRAM_SETUP.md](./TELEGRAM_SETUP.md)
   - Buat bot via BotFather
   - Setup admin group
   - Dapatkan bot token & chat ID

3. **Resend (Email)** - Sign up at [resend.com](https://resend.com)
   - Dapatkan API key
   - Setup sender email

### 3. Set Environment Variables

Di Supabase, pastikan environment variables berikut sudah di-set:

```bash
# Airtable
AIRTABLE_API_KEY=patXXXXXXXXXXXXXX
AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX
AIRTABLE_LEADS_TABLE_ID=Leads
AIRTABLE_BOOKINGS_TABLE_ID=Appointments

# Telegram
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
TELEGRAM_ADMIN_CHAT_ID=-1001234567890

# Email
RESEND_API_KEY=re_XXXXXXXXXXXXXXXX
RESEND_TO_EMAIL=admin@clinic.com
```

### 4. Test System

**NEW: Built-in Test Dashboard! 🧪**

Aplikasi sekarang memiliki **Test Dashboard** untuk verifikasi semua integrasi:

1. Buka aplikasi di browser
2. Klik tab **"Test Integrations"**
3. Test setiap service:
   - ✅ Environment Variables Check
   - ✅ Airtable Connection
   - ✅ Telegram Notification
   - ✅ Email (Resend)
   - ✅ Full Integration Test

Panduan lengkap: [TESTING_GUIDE.md](./TESTING_GUIDE.md)

#### Quick Test via UI

```
1. Click "Test Integrations" tab
2. Test Environment Variables → Should show all ✅
3. Test each service individually
4. Run "Full Integration Test"
5. Verify in Airtable, Telegram, and Email
```

#### Test via API (Optional)

```bash
curl -X POST https://[PROJECT_ID].supabase.co/functions/v1/make-server-1a9814d3/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer [ANON_KEY]" \
  -d '{
    "full_name": "Test User",
    "phone_number": "+6281234567890",
    "email": "test@example.com",
    "service_interest": "Laser Treatment",
    "preferred_date": "2026-04-10",
    "preferred_time": "10:00"
  }'
```

## 📚 API Documentation

### Endpoint: Create Booking

**URL:** `POST /make-server-1a9814d3/api/bookings`

**Request:**
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

**Validation Error (422):**
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

Dokumentasi lengkap: [Backend API Docs](/supabase/functions/server/README.md)

## 🎯 Data Validation Rules

| Field            | Rules                                        |
|------------------|----------------------------------------------|
| full_name        | Min 3 characters                             |
| phone_number     | Format: +62 + 10-15 digits                   |
| email            | Valid email format (RFC compliant)           |
| service_interest | Must be in allowed service list              |
| preferred_date   | Cannot be in the past                        |
| preferred_time   | Format: HH:mm (24-hour)                      |

**Valid Services:**
- Laser Treatment
- Facial Brightening
- Acne Treatment
- Skin Rejuvenation
- Anti-Aging Treatment
- Chemical Peeling

## 📊 Lead Scoring System

Setiap lead otomatis di-score 0-100 berdasarkan:

```
Base score:           50 points
Email provided:       +10 points
Valid phone:          +10 points
High-value service:   +20 points
Landing page source:  +10 points
────────────────────────────────
Maximum:              100 points
```

**Kategori:**
- 🔥 80-100: HOT lead
- 🟡 50-79: WARM lead
- 🔵 0-49: COLD lead

## 🔔 Notifications

### Telegram Format

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

HTML email dengan:
- Header dengan branding
- Detail pasien & appointment
- Instruksi follow-up
- Booking ID untuk tracking

## 🔍 Monitoring & Debugging

### View Logs

Di Supabase Dashboard → Functions → make-server-1a9814d3 → Logs

### Log Pattern

Success flow:
```
=== Booking API Request Received ===
→ Validation passed
→ Lead created: recXXX (score: 80)
→ Appointment created: recYYY
→ Telegram notification sent ✓
→ Email notification sent ✓
→ Booking processed successfully
```

## 🚨 Troubleshooting

### Common Issues

**Problem:** API returns 500 error
- Check Supabase logs
- Verify environment variables
- Test external API credentials

**Problem:** Data not in Airtable
- Verify API key has write permission
- Check table IDs match exactly
- Ensure field names are correct

**Problem:** No Telegram notification
- Bot must be member of group
- Bot needs "Post Messages" permission
- Chat ID must be correct (including `-` for groups)

**Problem:** No email received
- Check spam folder
- Verify Resend API key
- Recipient email must be correct

Panduan lengkap: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

## 📖 Documentation

- **[Backend API Documentation](/supabase/functions/server/README.md)** - API specs & endpoints
- **[Airtable Setup Guide](./AIRTABLE_SETUP.md)** - Database configuration
- **[Telegram Setup Guide](./TELEGRAM_SETUP.md)** - Bot configuration
- **[Deployment Guide](./DEPLOYMENT_GUIDE.md)** - Complete deployment steps
- **[Phase 1 Specification](/src/imports/#_Phase_1_Backend-First_Developme.txt)** - Original requirements

## ✅ Phase 1, 2 & 3 Completion Checklist

### Phase 1 - Backend System ✅
- [x] Database schema definition (Airtable)
- [x] API contract specification
- [x] Backend layered architecture
- [x] Data validation rules
- [x] Lead management & scoring
- [x] Appointment booking system
- [x] Airtable integration
- [x] Telegram notification system
- [x] Email notification system
- [x] Error handling & logging
- [x] Frontend integration API
- [x] Test dashboard with integration tests
- [x] Documentation complete

### Phase 2 - Landing Page ✅
- [x] Medical Elite Boutique design system
- [x] Premium typography (Cormorant Garamond + Plus Jakarta Sans)
- [x] Color system (Deep Emerald, Gold accents)
- [x] Complete landing page structure (11 sections)
- [x] Interactive before-after sliders
- [x] Testimonial carousel with auto-slide
- [x] Smooth scroll animations (Motion)
- [x] Micro-interactions on hover
- [x] Responsive design (mobile-first)
- [x] Image slot system for reusability
- [x] High-conversion CTA placement
- [x] Trust-building elements
- [x] Professional footer
- [x] Integration with booking form
- [x] Landing page documentation

### Phase 3 - Booking Page ✅ NEW!
- [x] Multi-step form design (4 steps)
- [x] Step indicator with progress bar
- [x] Doctor reference card
- [x] Live booking summary sidebar
- [x] Real-time validation with checkmarks
- [x] Personal information step (name, phone, email)
- [x] Service selection step
- [x] Schedule selection step (date & time)
- [x] Review & confirm step
- [x] Security trust signals
- [x] Smooth step transitions with animations
- [x] Mobile-optimized layout
- [x] Single column focused design
- [x] Backend integration
- [x] Confirmation page
- [x] Booking page documentation

## 🎯 System Status

**Phase 1 - Backend:** ✅ COMPLETE & PRODUCTION READY

**Phase 2 - Landing Page:** ✅ COMPLETE & PRODUCTION READY

**Phase 3 - Booking Flow:** ✅ COMPLETE & PRODUCTION READY

**Complete 3-Page Funnel:** ✅ READY FOR DEPLOYMENT

**All Systems:** ✅ FULLY FUNCTIONAL & TESTED

## 🤝 Contributing

Project ini dibuat untuk Agency Nexus. Untuk perubahan:
1. Test di development environment
2. Verify semua validasi berfungsi
3. Check logs untuk errors
4. Update dokumentasi jika perlu

## 📝 License

Private project untuk Agency Nexus.

## 🙏 Acknowledgments

- **Phase 0** - System Planning & Architecture
- **Phase 1** - Backend-First Development (Current)
- **Phase 2** - Frontend Development (Next)

---

**Status:** ✅ Phase 1 - Backend System READY FOR PRODUCTION

**Built with:** React • Tailwind • Supabase • Airtable • Telegram • Resend

**Architecture:** Layered • Modular • Scalable • Production-Ready

Made with ❤️ for Agency Nexus