// Doctor Reference Card - Trust & Human Element

import { motion } from 'motion/react';
import { Award, MapPin, Star } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface DoctorReferenceCardProps {
  doctorImage?: string;
  doctorName?: string;
  specialty?: string;
  clinicName?: string;
  rating?: number;
  yearsExperience?: number;
}

export function DoctorReferenceCard({
  doctorImage = 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop',
  doctorName = 'Dr. Sarah Anderson',
  specialty = 'Aesthetic Medicine Specialist',
  clinicName = 'Agency Nexus Clinic',
  rating = 4.9,
  yearsExperience = 15
}: DoctorReferenceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-[#f0fafa] to-white rounded-2xl p-6 border border-gray-100 shadow-sm"
    >
      <div className="flex items-center gap-4">
        {/* Doctor Photo */}
        <div className="relative">
          <div className="w-20 h-20 rounded-full overflow-hidden ring-2 ring-[#0d6e6e]/20">
            <ImageWithFallback
              src={doctorImage}
              alt={doctorName}
              className="w-full h-full object-cover"
            />
          </div>
          {/* Verified badge */}
          <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#0d6e6e] rounded-full flex items-center justify-center border-2 border-white">
            <Award className="size-4 text-white" />
          </div>
        </div>

        {/* Doctor Info */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900" style={{ fontFamily: 'var(--font-headline)' }}>
            {doctorName}
          </h3>
          <p className="text-sm text-gray-600 mb-2">
            {specialty}
          </p>
          
          {/* Stats */}
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Star className="size-3.5 fill-[#d4af37] text-[#d4af37]" />
              <span className="font-medium">{rating}</span>
            </div>
            <div className="flex items-center gap-1">
              <Award className="size-3.5" />
              <span>{yearsExperience}+ years</span>
            </div>
          </div>
        </div>
      </div>

      {/* Clinic Location */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="size-4 text-[#0d6e6e]" />
          <span>{clinicName}</span>
        </div>
      </div>

      {/* Trust message */}
      <div className="mt-4 bg-white/80 rounded-lg p-3 text-center">
        <p className="text-xs text-gray-600 italic">
          "Your health and beauty journey begins with a trusted expert"
        </p>
      </div>
    </motion.div>
  );
}
