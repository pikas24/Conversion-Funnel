// Premium Multi-step Booking Page
// Elite Boutique Medical Clinic Design

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowRight, Check, Lock, Phone, Mail, User, Sparkles, Calendar, Clock, FileText } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { StepIndicator } from './StepIndicator';
import { DoctorReferenceCard } from './DoctorReferenceCard';
import { BookingSummary } from './BookingSummary';
import { toast } from 'sonner';
import { projectId, publicAnonKey } from '../../../../utils/supabase/info';

const STEPS = [
  { number: 1, title: 'Personal Info', description: 'Your details' },
  { number: 2, title: 'Service', description: 'Select treatment' },
  { number: 3, title: 'Schedule', description: 'Date & time' },
  { number: 4, title: 'Confirm', description: 'Review booking' }
];

const SERVICES = [
  { value: 'laser', label: 'Laser Treatment', price: 'From Rp 299.000' },
  { value: 'facial', label: 'Facial Brightening', price: 'From Rp 199.000' },
  { value: 'acne', label: 'Acne Treatment', price: 'From Rp 249.000' },
  { value: 'rejuvenation', label: 'Skin Rejuvenation', price: 'From Rp 349.000' },
  { value: 'antiaging', label: 'Anti-Aging Treatment', price: 'From Rp 399.000' },
  { value: 'peeling', label: 'Chemical Peeling', price: 'From Rp 279.000' }
];

const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00'
];

interface FormData {
  fullName: string;
  phoneNumber: string;
  email: string;
  service: string;
  date: string;
  time: string;
  notes: string;
}

interface ValidationState {
  fullName: boolean;
  phoneNumber: boolean;
  email: boolean;
  service: boolean;
  date: boolean;
  time: boolean;
}

interface BookingPageProps {
  onBookingComplete: (bookingId: string, bookingDetails?: any) => void;
  onBack: () => void;
}

export function BookingPage({ onBookingComplete, onBack }: BookingPageProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    phoneNumber: '',
    email: '',
    service: '',
    date: '',
    time: '',
    notes: ''
  });

  const [validation, setValidation] = useState<ValidationState>({
    fullName: false,
    phoneNumber: false,
    email: true, // Email is optional, so default to true
    service: false,
    date: false,
    time: false
  });

  // Real-time validation
  const validateField = (field: keyof FormData, value: string) => {
    let isValid = false;

    switch (field) {
      case 'fullName':
        isValid = value.trim().length >= 3;
        break;
      case 'phoneNumber':
        // Match backend validation: +62 followed by 10-15 digits
        if (value.startsWith('+62')) {
          const digits = value.replace('+62', '');
          isValid = /^\d{10,15}$/.test(digits);
        } else {
          isValid = false;
        }
        break;
      case 'email':
        // Email is optional - empty is valid, or must be valid format
        isValid = value === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        // Set as true if empty since it's optional
        if (value === '') {
          setValidation(prev => ({ ...prev, [field]: true }));
          return true;
        }
        break;
      case 'service':
      case 'date':
      case 'time':
        isValid = value !== '';
        break;
    }

    setValidation(prev => ({ ...prev, [field]: isValid }));
    return isValid;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    validateField(field, value);
  };

  const canProceedToStep = (step: number): boolean => {
    switch (step) {
      case 2:
        // Step 1 to 2: Name + Phone must be valid, Email is optional but validated
        return validation.fullName && validation.phoneNumber && validation.email;
      case 3:
        // Step 2 to 3: Service must be selected
        return validation.service;
      case 4:
        // Step 3 to 4: Date and Time must be selected
        return validation.date && validation.time;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (canProceedToStep(currentStep + 1)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      toast.error('Please complete all required fields');
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    if (!canProceedToStep(4)) {
      toast.error('Please complete all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-1a9814d3/api/bookings`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({
            full_name: formData.fullName,
            phone_number: formData.phoneNumber,
            email: formData.email || undefined,
            service_interest: SERVICES.find(s => s.value === formData.service)?.label || formData.service,
            preferred_date: formData.date,
            preferred_time: formData.time,
            notes: formData.notes || undefined
          })
        }
      );

      const result = await response.json();

      // Phase 3 Integration: Check for success response
      if (response.ok && result.success === true) {
        toast.success('Booking request berhasil dikirim!');
        
        // Prepare booking details for confirmation page
        const bookingDetails = {
          bookingId: result.data?.booking_id || 'UNKNOWN',
          patientName: formData.fullName,
          phoneNumber: formData.phoneNumber,
          email: formData.email,
          service: SERVICES.find(s => s.value === formData.service)?.label,
          date: formatDate(formData.date),
          time: formData.time,
          doctorName: 'Dr. Sarah Anderson',
          clinicName: 'Agency Nexus Clinic'
        };
        
        // Redirect to confirmation page with booking details
        onBookingComplete(result.data?.booking_id || 'UNKNOWN', bookingDetails);
      } else {
        // Handle validation or server errors
        // Extract string message from response (handle both string and object)
        const errorMessage = typeof result.message === 'string' 
          ? result.message 
          : result.message?.message || 'Terjadi kesalahan, silakan coba lagi';
        
        toast.error(errorMessage);
        console.error('Booking error:', result);
      }
    } catch (error) {
      console.error('Booking network error:', error);
      toast.error('Network error. Please check your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getServicePrice = () => {
    const service = SERVICES.find(s => s.value === formData.service);
    return service?.price || 'To be confirmed';
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fafaf9] via-white to-[#f0fafa] py-8 md:py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-[#0d6e6e] transition-colors mb-6 group"
        >
          <ArrowLeft className="size-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Home</span>
        </button>

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 
            className="text-4xl md:text-5xl font-semibold text-gray-900 mb-4"
            style={{ fontFamily: 'var(--font-headline)' }}
          >
            Book Your Consultation
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Complete the steps below to schedule your personalized treatment consultation
          </p>
        </motion.div>

        {/* Step Indicator */}
        <div className="max-w-4xl mx-auto mb-12">
          <StepIndicator currentStep={currentStep} totalSteps={4} steps={STEPS} />
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Doctor Reference Card */}
            <DoctorReferenceCard />

            {/* Multi-step Form */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8"
            >
              <AnimatePresence mode="wait">
                {/* Step 1: Personal Information */}
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="text-2xl font-semibold text-gray-900 mb-2" style={{ fontFamily: 'var(--font-headline)' }}>
                        Personal Information
                      </h2>
                      <p className="text-gray-600">
                        Let us know who we'll be taking care of
                      </p>
                    </div>

                    {/* Full Name */}
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="text-sm font-medium">
                        Full Name <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                          <User className="size-5" />
                        </div>
                        <Input
                          id="fullName"
                          type="text"
                          placeholder="Enter your full name"
                          value={formData.fullName}
                          onChange={(e) => handleInputChange('fullName', e.target.value)}
                          className="pl-10 pr-10 h-12 text-base"
                          autoFocus
                        />
                        {validation.fullName && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <Check className="size-5 text-green-500" />
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">
                        Minimum 3 characters
                      </p>
                    </div>

                    {/* Phone Number */}
                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber" className="text-sm font-medium">
                        Phone Number <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                          <Phone className="size-5" />
                        </div>
                        <Input
                          id="phoneNumber"
                          type="tel"
                          placeholder="+628123456789"
                          value={formData.phoneNumber}
                          onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                          className="pl-10 pr-10 h-12 text-base"
                        />
                        {validation.phoneNumber && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <Check className="size-5 text-green-500" />
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">
                        Format: +62 followed by your number (e.g., +628123456789)
                      </p>
                    </div>

                    {/* Email (Optional) */}
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">
                        Email Address <span className="text-gray-400">(Optional)</span>
                      </Label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                          <Mail className="size-5" />
                        </div>
                        <Input
                          id="email"
                          type="email"
                          placeholder="your.email@example.com"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="pl-10 pr-10 h-12 text-base"
                        />
                        {formData.email && validation.email && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <Check className="size-5 text-green-500" />
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">
                        We'll send booking confirmation to this email
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Service Selection */}
                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="text-2xl font-semibold text-gray-900 mb-2" style={{ fontFamily: 'var(--font-headline)' }}>
                        Select Your Service
                      </h2>
                      <p className="text-gray-600">
                        Choose the treatment you're interested in
                      </p>
                    </div>

                    {/* Service Selection */}
                    <div className="space-y-3">
                      {SERVICES.map((service) => (
                        <button
                          key={service.value}
                          onClick={() => handleInputChange('service', service.value)}
                          className={`
                            w-full text-left p-4 rounded-xl border-2 transition-all
                            ${formData.service === service.value
                              ? 'border-[#0d6e6e] bg-[#f0fafa]'
                              : 'border-gray-200 hover:border-gray-300 bg-white'
                            }
                          `}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`
                                w-10 h-10 rounded-lg flex items-center justify-center
                                ${formData.service === service.value ? 'bg-[#0d6e6e]' : 'bg-gray-100'}
                              `}>
                                <Sparkles className={`size-5 ${formData.service === service.value ? 'text-white' : 'text-gray-400'}`} />
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900">{service.label}</p>
                                <p className="text-sm text-gray-500">{service.price}</p>
                              </div>
                            </div>
                            {formData.service === service.value && (
                              <Check className="size-6 text-[#0d6e6e]" />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Schedule */}
                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="text-2xl font-semibold text-gray-900 mb-2" style={{ fontFamily: 'var(--font-headline)' }}>
                        Choose Your Schedule
                      </h2>
                      <p className="text-gray-600">
                        Select your preferred date and time
                      </p>
                    </div>

                    {/* Date Selection */}
                    <div className="space-y-2">
                      <Label htmlFor="date" className="text-sm font-medium">
                        Preferred Date <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10 pointer-events-none">
                          <Calendar className="size-5" />
                        </div>
                        <Input
                          id="date"
                          type="date"
                          value={formData.date}
                          onChange={(e) => handleInputChange('date', e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                          className="pl-10 pr-10 h-12 text-base"
                        />
                        {validation.date && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <Check className="size-5 text-green-500" />
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">
                        Select an available date (today or future dates)
                      </p>
                    </div>

                    {/* Time Selection */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        Preferred Time <span className="text-red-500">*</span>
                      </Label>
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                        {TIME_SLOTS.map((slot) => (
                          <button
                            key={slot}
                            onClick={() => handleInputChange('time', slot)}
                            className={`
                              px-3 py-2.5 rounded-lg border-2 text-sm font-medium transition-all
                              ${formData.time === slot
                                ? 'border-[#0d6e6e] bg-[#0d6e6e] text-white'
                                : 'border-gray-200 hover:border-gray-300 bg-white text-gray-700'
                              }
                            `}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500">
                        All times are in WIB (Western Indonesian Time)
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Step 4: Confirm & Additional Notes */}
                {currentStep === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="text-2xl font-semibold text-gray-900 mb-2" style={{ fontFamily: 'var(--font-headline)' }}>
                        Review & Confirm
                      </h2>
                      <p className="text-gray-600">
                        Review your booking details and add any additional notes
                      </p>
                    </div>

                    {/* Booking Review */}
                    <div className="bg-[#f0fafa] rounded-xl p-6 space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                        <span className="text-sm text-gray-600">Patient Name</span>
                        <span className="font-semibold text-gray-900">{formData.fullName}</span>
                      </div>
                      <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                        <span className="text-sm text-gray-600">Phone Number</span>
                        <span className="font-semibold text-gray-900">{formData.phoneNumber}</span>
                      </div>
                      {formData.email && (
                        <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                          <span className="text-sm text-gray-600">Email</span>
                          <span className="font-semibold text-gray-900">{formData.email}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                        <span className="text-sm text-gray-600">Service</span>
                        <span className="font-semibold text-gray-900">
                          {SERVICES.find(s => s.value === formData.service)?.label}
                        </span>
                      </div>
                      <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                        <span className="text-sm text-gray-600">Date</span>
                        <span className="font-semibold text-gray-900">{formatDate(formData.date)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Time</span>
                        <span className="font-semibold text-gray-900">{formData.time} WIB</span>
                      </div>
                    </div>

                    {/* Additional Notes */}
                    <div className="space-y-2">
                      <Label htmlFor="notes" className="text-sm font-medium">
                        Additional Notes <span className="text-gray-400">(Optional)</span>
                      </Label>
                      <div className="relative">
                        <div className="absolute left-3 top-3 text-gray-400">
                          <FileText className="size-5" />
                        </div>
                        <Textarea
                          id="notes"
                          placeholder="Tell us about your skin concerns or any questions you have..."
                          value={formData.notes}
                          onChange={(e) => handleInputChange('notes', e.target.value)}
                          className="pl-10 min-h-[100px] text-base resize-none"
                          maxLength={500}
                        />
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-xs text-gray-500">
                          Share any specific concerns or questions
                        </p>
                        <p className="text-xs text-gray-400">
                          {formData.notes.length}/500
                        </p>
                      </div>
                    </div>

                    {/* Security Trust Signal */}
                    <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Lock className="size-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-green-900">
                          Your data is encrypted & secure
                        </p>
                        <p className="text-xs text-green-700">
                          We protect your privacy with industry-standard encryption
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                {currentStep > 1 ? (
                  <Button
                    variant="outline"
                    onClick={prevStep}
                    className="px-6"
                  >
                    <ArrowLeft className="size-4 mr-2" />
                    Previous
                  </Button>
                ) : (
                  <div />
                )}

                {currentStep < 4 ? (
                  <Button
                    onClick={nextStep}
                    disabled={!canProceedToStep(currentStep + 1)}
                    className="bg-[#0d6e6e] hover:bg-[#0a5555] text-white px-8"
                  >
                    Continue
                    <ArrowRight className="size-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting || !canProceedToStep(4)}
                    className="bg-[#0d6e6e] hover:bg-[#0a5555] text-white px-8"
                  >
                    {isSubmitting ? 'Processing...' : 'Confirm Booking'}
                    <Check className="size-4 ml-2" />
                  </Button>
                )}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Booking Summary */}
          <div className="lg:col-span-1">
            <BookingSummary
              data={{
                fullName: formData.fullName,
                service: SERVICES.find(s => s.value === formData.service)?.label,
                date: formatDate(formData.date),
                time: formData.time ? `${formData.time} WIB` : '',
                estimatedPrice: formData.service ? getServicePrice() : ''
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}