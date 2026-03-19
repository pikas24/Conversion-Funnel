Baca dan pahami _Phase_0_Funnel_Website_System_Blueprint.txt dan _Phase_1_Backend-First_Developme.txt yang berisi dokumentasi sistem Conversion Funnel untuk Agency Nexus.

Fungsi Phase 0
Phase 0 berfungsi sebagai system planning & architecture definition, yaitu mendefinisikan:
struktur sistem conversion funnel
arsitektur backend
konsep database
alur data sistem
integrasi layanan eksternal
Tujuannya adalah memastikan desain sistem dan struktur teknis sudah jelas sebelum implementasi dimulai.

Fungsi Phase 1
Phase 1 berfungsi sebagai backend-first development blueprint, yaitu mendefinisikan:
schema database secara rinci
relasi tabel
API contract
validation rules
backend architecture
automation trigger
Tujuannya adalah memastikan backend system sudah stabil sebelum frontend dibangun pada Phase 2.

Instruksi Implementasi
Berdasarkan _Phase_0_Funnel_Website_System_Blueprint.txt dan _Phase_1_Backend-First_Developme.txt, bangun backend system untuk Conversion Funnel dengan spesifikasi berikut.

1. Setup Database (Airtable)
Buat database dengan dua tabel utama:
Leads
Appointments

Relasi:
1 Lead → Many Appointments
Implementasikan seluruh field, relasi, dan struktur schema sesuai definisi dalam _Phase_1_Backend-First_Developme.txt.

2. Buat Backend API
Buat endpoint utama:
POST /api/bookings
Fungsi endpoint:
menerima data booking dari frontend
memvalidasi input
membuat record Lead
membuat record Appointment
menyimpan data ke Airtable
mengembalikan booking_id
Gunakan request dan response format yang didefinisikan pada _Phase_1_Backend-First_Developme.txt.

3. Implement Data Validation
Tambahkan validation layer untuk memastikan:
phone number format +62
email format valid
nama minimal 3 karakter
tanggal appointment tidak boleh di masa lalu
waktu format HH:mm
service harus valid
Ikuti seluruh validation rules dari _Phase_1_Backend-First_Developme.txt.

4. Implement Backend Architecture
Struktur backend harus mengikuti layered architecture:
API Layer
Validation Layer
Service Layer
Repository Layer
Trigger Layer

Gunakan struktur modul seperti:
/api
/services
/validators
/repositories
/triggers
/config
/utils

5. Implement Booking Workflow
Ketika user mengirim booking:
Receive API request
→ Validate input
→ Create Lead
→ Create Appointment
→ Save to Airtable
→ Trigger booking_created event
→ Return success response

6. Implement Automation Trigger
Saat event berikut terjadi:
booking_created

jalankan automation:
kirim Telegram notification
kirim Email notification
Format pesan harus mengikuti spesifikasi di _Phase_1_Backend-First_Developme.txt.

Output yang Harus Dibuat
Bangun sistem backend yang mencakup:
konfigurasi database Airtable
endpoint API /api/bookings
validation system
backend services
repository untuk database
automation trigger
integrasi Telegram dan Email
Pastikan backend siap digunakan oleh Phase 2 — Frontend Development.
