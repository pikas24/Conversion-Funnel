Gunakan file #_Phase_3_Integration_&_Testing_B.txt yang telah saya lampirkan sebagai referensi utama.

Bangun dan konfigurasikan seluruh kebutuhan Phase 3 Integration & Testing untuk Conversion Funnel System Agency Nexus tanpa mengubah arsitektur sistem yang sudah ditentukan.

Sistem menggunakan:

Frontend

 Landing Page
 Booking Page
 Confirmation Page

Backend

 Supabase Serverless Functions

Database

 Airtable

Notification

 Telegram Bot
 Email Notification menggunakan Resend

Tujuan Phase 3 adalah memastikan seluruh komponen frontend, backend, database, dan notification system terintegrasi dan dapat diuji end-to-end.

Lakukan hal-hal berikut:

1. Integrasikan Booking Form di Booking Page dengan backend endpoint:

POST `/api/book-appointment`

Pastikan form mengirim field berikut:

 full_name
 phone_number
 email
 service_interest
 preferred_date
 preferred_time

Tambahkan validasi frontend untuk field wajib sebelum request dikirim.

2. Implementasikan backend handler `/api/book-appointment` yang melakukan:

 validasi request payload
 membuat record baru pada Airtable Table: Leads
 membuat record baru pada Airtable Table: Appointments
 menghubungkan appointment dengan lead menggunakan `lead_id`

Gunakan struktur database sesuai dokumentasi:

Table Leads:

 full_name
 phone_number
 email
 service_interest
 status
 source
 created_at
 lead_score
 notes

Table Appointments:

 requested_service
 lead_id
 preferred_date
 preferred_time
 appointment_status
 created_at
 notes

Set default value:

Leads:
status = "new"
source = "funnel"
lead_score = 0

Appointments:
appointment_status = "requested"

3. Setelah data berhasil disimpan ke Airtable, trigger notification:

Telegram Bot Message ke admin klinik berisi:

 nama
 nomor WhatsApp
 layanan
 tanggal
 jam

Kirim juga Email Notification menggunakan Resend dengan isi detail booking.

4. Jika seluruh proses berhasil, kembalikan response:

```
{
  success: true,
  message: "Booking request berhasil dikirim"
}
```

Kemudian frontend harus:

redirect user ke halaman:

`/confirmation`

5. Implementasikan error handling berikut:

 validasi form gagal → tampilkan pesan error di frontend
 API gagal → tampilkan pesan "Terjadi kesalahan, silakan coba lagi"
 notifikasi gagal → data tetap disimpan tetapi error dicatat di log

6. Buat environment configuration untuk:

 Airtable API Key
 Airtable Base ID
 Telegram Bot Token
 Telegram Chat ID
 Resend API Key

7. Tambahkan testing mode untuk memverifikasi integrasi:

 lakukan pengujian submit form dari Booking Page
 pastikan data muncul di Airtable
 pastikan Telegram notification terkirim
 pastikan email notification terkirim
 pastikan redirect ke Confirmation Page berjalan

Jangan mengubah struktur halaman funnel, layout frontend, atau database schema.

Fokus Phase 3 hanya pada integrasi sistem dan pengujian alur booking end-to-end.
