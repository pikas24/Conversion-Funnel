// Booking trigger layer - handles automation and notifications

const TELEGRAM_BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN') || '';
const TELEGRAM_ADMIN_CHAT_ID = Deno.env.get('TELEGRAM_ADMIN_CHAT_ID') || '';
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') || '';
const RESEND_TO_EMAIL = Deno.env.get('RESEND_TO_EMAIL') || '';

// Rate Limiter for Resend API (5 requests per second limit)
class RateLimiter {
  private queue: Array<() => Promise<void>> = [];
  private processing = false;
  private lastRequestTime = 0;
  private minInterval = 250; // 250ms = 4 requests/second (safe buffer under 5/sec limit)

  async add<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await fn();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
      
      if (!this.processing) {
        this.processQueue();
      }
    });
  }

  private async processQueue(): Promise<void> {
    if (this.queue.length === 0) {
      this.processing = false;
      return;
    }

    this.processing = true;
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;

    // Add delay if needed to respect rate limit
    if (timeSinceLastRequest < this.minInterval) {
      await this.delay(this.minInterval - timeSinceLastRequest);
    }

    const task = this.queue.shift();
    if (task) {
      this.lastRequestTime = Date.now();
      await task();
    }

    // Process next item in queue
    this.processQueue();
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Global rate limiter instance for email notifications
const emailRateLimiter = new RateLimiter();

// Retry mechanism with exponential backoff
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 1000
): Promise<T> {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      // Check if it's a rate limit error
      const errorMessage = error?.message || '';
      const isRateLimitError = errorMessage.includes('429') || errorMessage.includes('rate_limit');
      
      if (isRateLimitError && attempt < maxRetries) {
        // Exponential backoff: 1s, 2s, 4s
        const delay = baseDelay * Math.pow(2, attempt);
        console.log(`Rate limit hit, retrying in ${delay}ms... (attempt ${attempt + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      
      // If not rate limit error or max retries reached, throw
      if (attempt === maxRetries) {
        throw lastError;
      }
    }
  }
  
  throw lastError || new Error('Retry failed');
}

export interface BookingCreatedEvent {
  lead: {
    id: string;
    full_name: string;
    phone_number: string;
    email: string;
  };
  appointment: {
    id: string;
    requested_service: string;
    preferred_date: string;
    preferred_time: string;
  };
}

// Send Telegram notification to admin
export async function sendTelegramNotification(event: BookingCreatedEvent): Promise<void> {
  try {
    // Format date for Indonesian format
    const dateObj = new Date(event.appointment.preferred_date);
    const formattedDate = dateObj.toLocaleDateString('id-ID', { 
      day: 'numeric', 
      month: 'long',
      year: 'numeric'
    });

    const message = `
🔔 *BOOKING BARU – BELUM DIKONTAK*

👤 *Nama:* ${event.lead.full_name}
💆 *Treatment:* ${event.appointment.requested_service}
📅 *Tanggal:* ${formattedDate}
🕐 *Jam:* ${event.appointment.preferred_time}
📱 *Phone:* ${event.lead.phone_number}
📧 *Email:* ${event.lead.email}

🆔 *Booking ID:* ${event.appointment.id}
    `.trim();

    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_ADMIN_CHAT_ID,
        text: message,
        parse_mode: 'Markdown',
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Telegram API error:', error);
      throw new Error(`Failed to send Telegram notification: ${error}`);
    }

    console.log('Telegram notification sent successfully');
  } catch (error) {
    console.error('Error sending Telegram notification:', error);
    // Don't throw - we don't want to fail the booking if notification fails
  }
}

// Send Email notification to admin (core function without error catching)
async function sendEmailNotificationCore(event: BookingCreatedEvent): Promise<void> {
  // Format date for Indonesian format
  const dateObj = new Date(event.appointment.preferred_date);
  const formattedDate = dateObj.toLocaleDateString('id-ID', { 
    day: 'numeric', 
    month: 'long',
    year: 'numeric'
  });

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
    .content { background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
    .field { margin: 10px 0; }
    .label { font-weight: bold; color: #555; }
    .value { color: #000; }
    .footer { margin-top: 20px; padding: 20px; text-align: center; font-size: 12px; color: #777; }
  </style>
</head>
<body>
  <div class=\"container\">
    <div class=\"header\">
      <h1>🔔 Booking Baru Masuk</h1>
    </div>
    <div class=\"content\">
      <p><strong>Status:</strong> BELUM DIKONTAK</p>
      
      <div class=\"field\">
        <span class=\"label\">Nama Pasien:</span>
        <span class=\"value\">${event.lead.full_name}</span>
      </div>
      
      <div class=\"field\">
        <span class=\"label\">Treatment:</span>
        <span class=\"value\">${event.appointment.requested_service}</span>
      </div>
      
      <div class=\"field\">
        <span class=\"label\">Tanggal:</span>
        <span class=\"value\">${formattedDate}</span>
      </div>
      
      <div class=\"field\">
        <span class=\"label\">Jam:</span>
        <span class=\"value\">${event.appointment.preferred_time}</span>
      </div>
      
      <div class=\"field\">
        <span class=\"label\">Nomor WhatsApp:</span>
        <span class=\"value\">${event.lead.phone_number}</span>
      </div>
      
      <div class=\"field\">
        <span class=\"label\">Email:</span>
        <span class=\"value\">${event.lead.email}</span>
      </div>
      
      <div class=\"field\">
        <span class=\"label\">Booking ID:</span>
        <span class=\"value\">${event.appointment.id}</span>
      </div>
      
      <hr style=\"margin: 20px 0;\">
      
      <p><strong>Instruksi Follow-up:</strong></p>
      <ol>
        <li>Hubungi pasien melalui WhatsApp dalam 1x24 jam</li>
        <li>Konfirmasi ketersediaan jadwal</li>
        <li>Update status appointment di Airtable</li>
        <li>Kirim reminder H-1 sebelum appointment</li>
      </ol>
    </div>
    <div class=\"footer\">
      <p>Notifikasi otomatis dari Conversion Funnel System - Agency Nexus</p>
    </div>
  </div>
</body>
</html>
  `.trim();

  const url = 'https://api.resend.com/emails';
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Agency Nexus <onboarding@resend.dev>',
      to: [RESEND_TO_EMAIL],
      subject: `🔔 Booking Baru: ${event.lead.full_name} - ${event.appointment.requested_service}`,
      html: htmlContent,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('Resend API error:', error);
    throw new Error(`Failed to send email notification: ${error}`);
  }

  console.log('Email notification sent successfully');
}

// Send Email notification to admin (with rate limiting and retry)
export async function sendEmailNotification(event: BookingCreatedEvent): Promise<void> {
  try {
    // Use rate limiter and retry mechanism
    await emailRateLimiter.add(() => 
      retryWithBackoff(() => sendEmailNotificationCore(event))
    );
  } catch (error) {
    console.error('Error sending email notification after retries:', error);
    // Don't throw - we don't want to fail the booking if notification fails
  }
}

// Handle booking_created event
export async function handleBookingCreated(event: BookingCreatedEvent): Promise<void> {
  console.log('Triggering booking_created event automation');
  
  // Send notifications in parallel (email uses rate limiter internally)
  await Promise.all([
    sendTelegramNotification(event),
    sendEmailNotification(event),
  ]);
  
  console.log('Booking automation completed');
}