# Telegram Bot Setup Guide

Panduan untuk setup Telegram Bot notification system untuk Conversion Funnel

## Prerequisites

1. Akun Telegram
2. Akses ke BotFather di Telegram

## Step 1: Buat Bot Baru

1. Buka Telegram dan cari **@BotFather**
2. Kirim command: `/newbot`
3. BotFather akan meminta nama bot Anda
4. Masukkan nama: **"Agency Nexus Booking Bot"**
5. BotFather akan meminta username bot (harus unik dan diakhiri dengan "bot")
6. Masukkan username: **"agencynexus_booking_bot"** (atau username lain yang available)
7. BotFather akan memberikan **API Token**
8. Copy token ini (format: `1234567890:ABCdefGHIjklMNOpqrsTUVwxyz`)

**Simpan token ini sebagai `TELEGRAM_BOT_TOKEN`**

## Step 2: Setup Admin Group/Channel

### Option A: Private Group (Recommended)

1. Buat group baru di Telegram
2. Beri nama: **"Agency Nexus - Bookings"**
3. Tambahkan bot Anda ke group:
   - Klik nama group → Add Members
   - Cari username bot Anda
   - Add bot ke group
4. Jadikan bot sebagai Admin:
   - Klik nama group → Edit
   - Administrators → Add Administrator
   - Pilih bot Anda
   - Beri permission minimal: "Post Messages"

### Option B: Personal Chat (Testing)

Untuk testing, Anda bisa menggunakan personal chat dengan bot:

1. Cari bot Anda di Telegram
2. Klik **Start** atau kirim `/start`
3. Bot sekarang bisa mengirim pesan ke Anda

## Step 3: Dapatkan Chat ID

### Untuk Group:

1. Tambahkan bot **@RawDataBot** ke group Anda
2. Bot akan otomatis mengirim data group
3. Cari `"chat":{"id":-1001234567890}`
4. Copy angka ID tersebut (termasuk tanda minus jika ada)
5. Hapus @RawDataBot dari group (tidak diperlukan lagi)

**Contoh Chat ID group:** `-1001234567890`

### Untuk Personal Chat:

1. Kirim pesan ke bot Anda
2. Buka browser dan akses URL:
   ```
   https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates
   ```
   Ganti `<YOUR_BOT_TOKEN>` dengan token bot Anda
3. Cari `"chat":{"id":1234567890}`
4. Copy angka ID tersebut

**Contoh Chat ID personal:** `1234567890`

### Alternatif - Menggunakan @userinfobot:

1. Forward pesan dari group/chat Anda ke **@userinfobot**
2. Bot akan reply dengan info termasuk Chat ID

**Simpan Chat ID ini sebagai `TELEGRAM_ADMIN_CHAT_ID`**

## Step 4: Test Bot

Test apakah bot dapat mengirim pesan:

### Via Browser/curl:

```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/sendMessage" \
  -H "Content-Type: application/json" \
  -d '{
    "chat_id": "<YOUR_CHAT_ID>",
    "text": "Test message from Agency Nexus Bot"
  }'
```

Ganti:
- `<YOUR_BOT_TOKEN>` dengan token bot Anda
- `<YOUR_CHAT_ID>` dengan Chat ID Anda

Jika berhasil, Anda akan menerima pesan di group/chat.

## Step 5: Set Environment Variables

Di Figma Make / Supabase, set environment variables:

```bash
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
TELEGRAM_ADMIN_CHAT_ID=-1001234567890
```

## Step 6: Verifikasi Notifikasi

Setelah setup selesai, setiap booking baru akan mengirim notifikasi ke Telegram dengan format:

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

## Customization

Anda dapat mengubah format pesan di file:
```
/supabase/functions/server/booking.trigger.tsx
```

Cari fungsi `sendTelegramNotification()` dan modifikasi template pesan.

## Multi-Admin Support

Untuk mengirim ke beberapa admin/group:

### Option 1: Multiple Group Members
Tambahkan semua admin sebagai member di group yang sama.

### Option 2: Multiple Groups (Requires Code Modification)
Di `booking.trigger.tsx`, modifikasi untuk mengirim ke multiple chat IDs:

```typescript
const ADMIN_CHAT_IDS = [
  '-1001234567890', // Main admin group
  '9876543210',     // Owner personal chat
  '-1009876543210', // Secondary group
];

// Send to all chat IDs
await Promise.all(
  ADMIN_CHAT_IDS.map(chatId => 
    sendTelegramToChat(event, chatId)
  )
);
```

## Troubleshooting

### Error: "Unauthorized"
- Bot token salah
- Copy ulang token dari BotFather

### Error: "Chat not found"
- Chat ID salah
- Pastikan bot sudah di-add ke group
- Cek apakah ada tanda minus untuk group ID

### Error: "Bot was blocked by the user"
- Di personal chat, pastikan Anda sudah klik Start
- Bot tidak bisa mengirim ke user yang block bot

### Pesan tidak diterima
- Pastikan bot masih member di group
- Cek bot punya permission "Post Messages"
- Verifikasi Chat ID benar

## Tips

1. **Testing**: Gunakan personal chat untuk testing terlebih dahulu
2. **Group Privacy**: Gunakan private group untuk keamanan data pasien
3. **Bot Name**: Pilih nama yang jelas untuk memudahkan identifikasi
4. **Message Format**: Sesuaikan format pesan dengan kebutuhan klinik
5. **Quiet Hours**: Pertimbangkan untuk disable notifikasi di jam tertentu (requires code)

## Security Notes

⚠️ **PENTING:**
- Jangan share Bot Token ke publik
- Simpan token di environment variables, bukan di code
- Gunakan private group untuk data pasien
- Pastikan hanya admin yang ada di group

## Advanced Features (Optional)

### 1. Command Handler
Tambahkan command untuk bot (requires additional code):
- `/status` - Check booking status
- `/today` - List bookings hari ini
- `/stats` - Statistik bookings

### 2. Interactive Buttons
Gunakan Telegram Inline Keyboard untuk:
- Confirm booking
- Reschedule
- Mark as contacted

### 3. Rich Formatting
Telegram mendukung Markdown dan HTML formatting:
- **Bold**: `*text*` atau `<b>text</b>`
- *Italic*: `_text_` atau `<i>text</i>`
- `Code`: \`text\` atau `<code>text</code>`

## Resources

- Telegram Bot API: https://core.telegram.org/bots/api
- BotFather Commands: https://core.telegram.org/bots#botfather
- Formatting Options: https://core.telegram.org/bots/api#formatting-options

## Next Steps

Setelah Telegram setup selesai, sistem akan:
1. ✅ Terima booking baru
2. ✅ Kirim notifikasi real-time ke Telegram
3. ✅ Admin dapat langsung follow-up
4. ✅ Tracking di Airtable
