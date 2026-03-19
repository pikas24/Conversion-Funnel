// Booking Summary Card - Order Review

import { motion } from 'motion/react';
import { Calendar, Clock, User, Sparkles, CheckCircle2 } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface BookingSummaryData {
  fullName?: string;
  service?: string;
  date?: string;
  time?: string;
  estimatedPrice?: string;
}

interface BookingSummaryProps {
  data: BookingSummaryData;
  doctorImage?: string;
  doctorName?: string;
}

export function BookingSummary({ 
  data, 
  doctorImage = 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop',
  doctorName = 'Dr. Sarah Anderson'
}: BookingSummaryProps) {
  const hasData = data.fullName || data.service || data.date || data.time;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white rounded-2xl border-2 border-gray-100 shadow-sm sticky top-6"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0d6e6e] to-[#0a5555] p-6 rounded-t-2xl">
        <h3 className="text-white text-xl font-semibold" style={{ fontFamily: 'var(--font-headline)' }}>
          Booking Summary
        </h3>
        <p className="text-white/80 text-sm mt-1">
          Review your appointment details
        </p>
      </div>

      <div className="p-6">
        {!hasData ? (
          /* Empty state */
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="size-8 text-gray-400" />
            </div>
            <p className="text-gray-500 text-sm">
              Fill in the form to see your booking summary
            </p>
          </div>
        ) : (
          /* Summary content */
          <div className="space-y-4">
            {/* Doctor */}
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
              <div className="w-12 h-12 rounded-full overflow-hidden">
                <ImageWithFallback
                  src={doctorImage}
                  alt={doctorName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{doctorName}</p>
                <p className="text-xs text-gray-500">Aesthetic Specialist</p>
              </div>
            </div>

            {/* Patient Name */}
            {data.fullName && (
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-[#f0fafa] rounded-lg flex items-center justify-center flex-shrink-0">
                  <User className="size-5 text-[#0d6e6e]" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1">Patient Name</p>
                  <p className="font-medium text-gray-900">{data.fullName}</p>
                </div>
                <CheckCircle2 className="size-5 text-green-500 flex-shrink-0" />
              </div>
            )}

            {/* Service */}
            {data.service && (
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-[#f0fafa] rounded-lg flex items-center justify-center flex-shrink-0">
                  <Sparkles className="size-5 text-[#0d6e6e]" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1">Service</p>
                  <p className="font-medium text-gray-900">{data.service}</p>
                </div>
                <CheckCircle2 className="size-5 text-green-500 flex-shrink-0" />
              </div>
            )}

            {/* Date */}
            {data.date && (
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-[#f0fafa] rounded-lg flex items-center justify-center flex-shrink-0">
                  <Calendar className="size-5 text-[#0d6e6e]" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1">Date</p>
                  <p className="font-medium text-gray-900">{data.date}</p>
                </div>
                <CheckCircle2 className="size-5 text-green-500 flex-shrink-0" />
              </div>
            )}

            {/* Time */}
            {data.time && (
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-[#f0fafa] rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="size-5 text-[#0d6e6e]" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1">Time</p>
                  <p className="font-medium text-gray-900">{data.time}</p>
                </div>
                <CheckCircle2 className="size-5 text-green-500 flex-shrink-0" />
              </div>
            )}

            {/* Estimated Price */}
            {data.estimatedPrice && (
              <div className="pt-4 border-t border-gray-100">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600">Consultation Fee</p>
                  <p className="text-xl font-bold text-[#0d6e6e]" style={{ fontFamily: 'var(--font-headline)' }}>
                    {data.estimatedPrice}
                  </p>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  *Final price will be confirmed after consultation
                </p>
              </div>
            )}
          </div>
        )}

        {/* Trust Signal */}
        <div className="mt-6 pt-6 border-t border-gray-100">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="size-3 text-green-600" />
            </div>
            <span>Your data is encrypted & secure</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
