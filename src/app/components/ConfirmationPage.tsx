// Elite Boutique Healthcare Confirmation Page
// Premium Success Experience with Downloadable Booking Proof

import { useRef } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Calendar, Clock, User, Sparkles, Download, Phone, Mail, MapPin, MessageCircle, Home, FileText, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { toPng } from 'html-to-image';
import { toast } from 'sonner';

interface BookingDetails {
  bookingId: string;
  patientName?: string;
  phoneNumber?: string;
  email?: string;
  service?: string;
  date?: string;
  time?: string;
  doctorName?: string;
  clinicName?: string;
}

interface ConfirmationPageProps {
  bookingId: string;
  bookingDetails?: BookingDetails;
  onBackToHome: () => void;
}

export function ConfirmationPage({ 
  bookingId, 
  bookingDetails = {
    bookingId,
    patientName: 'John Doe',
    phoneNumber: '+62 812-3456-7890',
    email: 'john@example.com',
    service: 'Laser Treatment',
    date: 'Senin, 17 Maret 2026',
    time: '14:00 WIB',
    doctorName: 'Dr. Sarah Anderson',
    clinicName: 'Agency Nexus Clinic'
  },
  onBackToHome 
}: ConfirmationPageProps) {
  const bookingCardRef = useRef<HTMLDivElement>(null);

  // Download booking proof as PNG
  const handleDownloadProof = async () => {
    if (!bookingCardRef.current) return;

    try {
      toast.loading('Generating booking proof...');
      
      const dataUrl = await toPng(bookingCardRef.current, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: '#ffffff'
      });

      const link = document.createElement('a');
      link.download = `booking-${bookingId}.png`;
      link.href = dataUrl;
      link.click();

      toast.dismiss();
      toast.success('Booking proof downloaded successfully!');
    } catch (error) {
      console.error('Error generating booking proof:', error);
      toast.dismiss();
      toast.error('Failed to generate booking proof');
    }
  };

  // Add to Google Calendar
  const handleAddToGoogleCalendar = () => {
    const eventTitle = `Consultation: ${bookingDetails.service}`;
    const eventDetails = `Doctor: ${bookingDetails.doctorName}\nBooking ID: ${bookingId}`;
    const eventLocation = bookingDetails.clinicName;
    
    // Convert date/time to proper format (simplified for demo)
    const startDate = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventTitle)}&details=${encodeURIComponent(eventDetails)}&location=${encodeURIComponent(eventLocation)}&dates=${startDate}/${startDate}`;
    
    window.open(googleCalendarUrl, '_blank');
  };

  // Add to Apple Calendar (iCal format)
  const handleAddToAppleCalendar = () => {
    toast.info('Apple Calendar integration coming soon');
  };

  const handleWhatsAppContact = () => {
    window.open('https://wa.me/6281234567890', '_blank');
  };

  const handlePhoneContact = () => {
    window.location.href = 'tel:+6281234567890';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fafaf9] via-white to-[#f0fafa] py-12 md:py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        
        {/* Success Confirmation Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
            className="inline-flex items-center justify-center mb-8"
          >
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-green-50 to-emerald-50 rounded-full flex items-center justify-center">
                <CheckCircle2 className="size-14 text-[#0d6e6e]" strokeWidth={2} />
              </div>
              {/* Subtle pulse ring */}
              <div className="absolute inset-0 w-24 h-24 bg-[#0d6e6e]/10 rounded-full animate-ping" style={{ animationDuration: '2s' }} />
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-4xl md:text-5xl lg:text-6xl font-semibold text-gray-900 mb-4"
            style={{ fontFamily: 'var(--font-headline)' }}
          >
            Janji Temu Anda Telah Dikonfirmasi
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Permintaan booking Anda telah berhasil kami terima dan sedang diproses oleh tim kami
          </motion.p>
        </motion.div>

        {/* Booking Summary Card - FOR SCREENSHOT & DOWNLOAD */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mb-12"
        >
          <div
            ref={bookingCardRef}
            className="bg-white rounded-3xl shadow-lg border-2 border-gray-100 overflow-hidden"
          >
            {/* Card Header */}
            <div className="bg-gradient-to-r from-[#0d6e6e] to-[#0a5555] px-8 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-white text-2xl font-semibold mb-1" style={{ fontFamily: 'var(--font-headline)' }}>
                    Booking Confirmation
                  </h2>
                  <p className="text-white/80 text-sm">
                    {bookingDetails.clinicName}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-white/70 text-xs mb-1">Booking ID</p>
                  <p className="text-white font-mono font-semibold text-lg">
                    {bookingId}
                  </p>
                </div>
              </div>
            </div>

            {/* Card Body */}
            <div className="px-8 py-8">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Patient Info */}
                <div className="space-y-5">
                  <div>
                    <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Informasi Pasien</p>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#f0fafa] rounded-lg flex items-center justify-center">
                          <User className="size-5 text-[#0d6e6e]" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Nama Pasien</p>
                          <p className="font-semibold text-gray-900">{bookingDetails.patientName}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#f0fafa] rounded-lg flex items-center justify-center">
                          <Phone className="size-5 text-[#0d6e6e]" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Nomor Telepon</p>
                          <p className="font-semibold text-gray-900">{bookingDetails.phoneNumber}</p>
                        </div>
                      </div>
                      {bookingDetails.email && (
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#f0fafa] rounded-lg flex items-center justify-center">
                            <Mail className="size-5 text-[#0d6e6e]" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Email</p>
                            <p className="font-semibold text-gray-900">{bookingDetails.email}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Appointment Details */}
                <div className="space-y-5">
                  <div>
                    <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Detail Appointment</p>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#f0fafa] rounded-lg flex items-center justify-center">
                          <Sparkles className="size-5 text-[#0d6e6e]" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Layanan</p>
                          <p className="font-semibold text-gray-900">{bookingDetails.service}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#f0fafa] rounded-lg flex items-center justify-center">
                          <Calendar className="size-5 text-[#0d6e6e]" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Tanggal</p>
                          <p className="font-semibold text-gray-900">{bookingDetails.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#f0fafa] rounded-lg flex items-center justify-center">
                          <Clock className="size-5 text-[#0d6e6e]" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Waktu</p>
                          <p className="font-semibold text-gray-900">{bookingDetails.time}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Doctor Info */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-xs text-gray-500 mb-3 uppercase tracking-wider">Dokter yang Menangani</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#0d6e6e] to-[#0a5555] rounded-full flex items-center justify-center">
                    <User className="size-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-lg">{bookingDetails.doctorName}</p>
                    <p className="text-sm text-gray-600">Aesthetic Medicine Specialist</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Card Footer */}
            <div className="bg-gradient-to-r from-gray-50 to-emerald-50 px-8 py-4 border-t border-gray-100">
              <div className="flex items-center justify-between text-sm">
                <p className="text-gray-600">
                  <span className="font-semibold text-gray-900">{bookingDetails.clinicName}</span>
                </p>
                <p className="text-gray-500">
                  Generated on {new Date().toLocaleDateString('id-ID')}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Download Booking Proof Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mb-16"
        >
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#f0fafa] rounded-xl flex items-center justify-center flex-shrink-0">
                <Download className="size-6 text-[#0d6e6e]" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Simpan Bukti Booking Anda
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Unduh bukti booking dalam format PNG untuk disimpan atau ditunjukkan saat datang ke klinik
                </p>
                <Button
                  onClick={handleDownloadProof}
                  className="bg-[#0d6e6e] hover:bg-[#0a5555] text-white"
                >
                  <Download className="size-4 mr-2" />
                  Download Booking Confirmation
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Add to Calendar Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="mb-16"
        >
          <h3 className="text-2xl font-semibold text-gray-900 mb-6 text-center" style={{ fontFamily: 'var(--font-headline)' }}>
            Tambahkan ke Kalender Anda
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <button
              onClick={handleAddToGoogleCalendar}
              className="bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-[#0d6e6e] rounded-xl p-6 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                  <Calendar className="size-6 text-blue-600" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900 mb-1">Google Calendar</p>
                  <p className="text-sm text-gray-600">Sinkronisasi dengan akun Google Anda</p>
                </div>
              </div>
            </button>

            <button
              onClick={handleAddToAppleCalendar}
              className="bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-[#0d6e6e] rounded-xl p-6 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                  <Calendar className="size-6 text-gray-700" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900 mb-1">Apple Calendar</p>
                  <p className="text-sm text-gray-600">Tambahkan ke iCal atau iOS Calendar</p>
                </div>
              </div>
            </button>
          </div>
        </motion.div>

        {/* Next Steps Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mb-16"
        >
          <h3 className="text-2xl font-semibold text-gray-900 mb-8 text-center" style={{ fontFamily: 'var(--font-headline)' }}>
            Langkah Selanjutnya
          </h3>
          <div className="space-y-4">
            {/* Step 1 */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#0d6e6e] text-white rounded-xl flex items-center justify-center flex-shrink-0 text-xl font-bold">
                  1
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    Periksa Email Anda
                  </h4>
                  <p className="text-gray-600">
                    Kami telah mengirimkan email konfirmasi dengan detail lengkap appointment Anda. Periksa inbox atau folder spam Anda.
                  </p>
                </div>
                <ChevronRight className="size-5 text-gray-400 flex-shrink-0" />
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#0d6e6e] text-white rounded-xl flex items-center justify-center flex-shrink-0 text-xl font-bold">
                  2
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    Datang 15 Menit Lebih Awal
                  </h4>
                  <p className="text-gray-600">
                    Harap tiba 15 menit sebelum jadwal appointment untuk proses registrasi dan persiapan konsultasi.
                  </p>
                </div>
                <ChevronRight className="size-5 text-gray-400 flex-shrink-0" />
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#0d6e6e] text-white rounded-xl flex items-center justify-center flex-shrink-0 text-xl font-bold">
                  3
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    Bawa Identitas & Bukti Booking
                  </h4>
                  <p className="text-gray-600">
                    Siapkan kartu identitas (KTP/SIM) dan tunjukkan bukti booking atau Booking ID Anda saat check-in di klinik.
                  </p>
                </div>
                <ChevronRight className="size-5 text-gray-400 flex-shrink-0" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Help Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="mb-16"
        >
          <div className="bg-gradient-to-br from-[#f0fafa] to-white rounded-2xl border border-gray-100 p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">
              Perlu Bantuan atau Ingin Reschedule?
            </h3>
            <p className="text-gray-600 text-center mb-6">
              Tim kami siap membantu Anda kapan saja
            </p>
            
            <div className="grid md:grid-cols-3 gap-4">
              {/* WhatsApp */}
              <button
                onClick={handleWhatsAppContact}
                className="bg-white hover:bg-green-50 border-2 border-gray-200 hover:border-green-500 rounded-xl p-4 transition-all group"
              >
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-green-100 transition-colors">
                    <MessageCircle className="size-6 text-green-600" />
                  </div>
                  <p className="font-semibold text-gray-900 mb-1">WhatsApp</p>
                  <p className="text-xs text-gray-600">Chat langsung dengan kami</p>
                </div>
              </button>

              {/* Phone */}
              <button
                onClick={handlePhoneContact}
                className="bg-white hover:bg-blue-50 border-2 border-gray-200 hover:border-blue-500 rounded-xl p-4 transition-all group"
              >
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-100 transition-colors">
                    <Phone className="size-6 text-blue-600" />
                  </div>
                  <p className="font-semibold text-gray-900 mb-1">Telepon</p>
                  <p className="text-xs text-gray-600">+62 812-3456-7890</p>
                </div>
              </button>

              {/* Email */}
              <a
                href="mailto:info@agencynexus.com"
                className="bg-white hover:bg-purple-50 border-2 border-gray-200 hover:border-purple-500 rounded-xl p-4 transition-all group"
              >
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-purple-100 transition-colors">
                    <Mail className="size-6 text-purple-600" />
                  </div>
                  <p className="font-semibold text-gray-900 mb-1">Email</p>
                  <p className="text-xs text-gray-600">info@agencynexus.com</p>
                </div>
              </a>
            </div>
          </div>
        </motion.div>

        {/* Back to Home Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="text-center"
        >
          <Button
            onClick={onBackToHome}
            variant="outline"
            className="border-2 border-[#0d6e6e] text-[#0d6e6e] hover:bg-[#f0fafa] px-8 py-6 text-lg"
          >
            <Home className="size-5 mr-2" />
            Kembali ke Halaman Utama
          </Button>
        </motion.div>

        {/* Minimal Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.5 }}
          className="mt-20 pt-8 border-t border-gray-200 text-center"
        >
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-2">
            <MapPin className="size-4" />
            <span>{bookingDetails.clinicName} • Jakarta, Indonesia</span>
          </div>
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} Agency Nexus. Sistem booking profesional untuk klinik kecantikan.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
