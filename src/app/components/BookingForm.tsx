// Booking Form Component - Example frontend integration

import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Calendar } from 'lucide-react';
import { createBooking, BookingData, BookingResponse } from '../utils/api';
import { toast } from 'sonner';

export function BookingForm() {
  const [formData, setFormData] = useState<BookingData>({
    full_name: '',
    phone_number: '+62',
    email: '',
    service_interest: '',
    preferred_date: '',
    preferred_time: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const services = [
    'Laser Treatment',
    'Facial Brightening',
    'Acne Treatment',
    'Skin Rejuvenation',
    'Anti-Aging Treatment',
    'Chemical Peeling'
  ];

  const handleInputChange = (field: keyof BookingData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      console.log('Submitting booking:', formData);
      const response: BookingResponse = await createBooking(formData);

      if (response.status === 'success') {
        toast.success('Booking berhasil dibuat!', {
          description: `Booking ID: ${response.booking_id}. Admin kami akan segera menghubungi Anda.`,
          duration: 5000,
        });
        
        // Reset form
        setFormData({
          full_name: '',
          phone_number: '+62',
          email: '',
          service_interest: '',
          preferred_date: '',
          preferred_time: '',
        });
      } else if (response.error_code === 'VALIDATION_ERROR' && response.errors) {
        // Handle validation errors
        const errorMap: Record<string, string> = {};
        response.errors.forEach(err => {
          errorMap[err.field] = err.message;
        });
        setErrors(errorMap);
        
        toast.error('Validasi gagal', {
          description: 'Mohon periksa kembali data yang Anda masukkan.',
        });
      } else {
        toast.error('Terjadi kesalahan', {
          description: response.message || 'Mohon coba lagi nanti.',
        });
      }
    } catch (error) {
      console.error('Error submitting booking:', error);
      toast.error('Terjadi kesalahan', {
        description: 'Tidak dapat terhubung ke server. Mohon coba lagi.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="size-6" />
          Book Your Appointment
        </CardTitle>
        <CardDescription>
          Fill in your details to book a consultation with our clinic
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="full_name">Full Name *</Label>
            <Input
              id="full_name"
              type="text"
              placeholder="e.g. Siti Rahma"
              value={formData.full_name}
              onChange={(e) => handleInputChange('full_name', e.target.value)}
              className={errors.full_name ? 'border-red-500' : ''}
              required
            />
            {errors.full_name && (
              <p className="text-sm text-red-500">{errors.full_name}</p>
            )}
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <Label htmlFor="phone_number">WhatsApp Number *</Label>
            <Input
              id="phone_number"
              type="tel"
              placeholder="+6281234567890"
              value={formData.phone_number}
              onChange={(e) => handleInputChange('phone_number', e.target.value)}
              className={errors.phone_number ? 'border-red-500' : ''}
              required
            />
            {errors.phone_number && (
              <p className="text-sm text-red-500">{errors.phone_number}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Format: +62 followed by your number
            </p>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={errors.email ? 'border-red-500' : ''}
              required
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Service Interest */}
          <div className="space-y-2">
            <Label htmlFor="service_interest">Treatment Service *</Label>
            <Select
              value={formData.service_interest}
              onValueChange={(value) => handleInputChange('service_interest', value)}
              required
            >
              <SelectTrigger className={errors.service_interest ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select a treatment" />
              </SelectTrigger>
              <SelectContent>
                {services.map((service) => (
                  <SelectItem key={service} value={service}>
                    {service}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.service_interest && (
              <p className="text-sm text-red-500">{errors.service_interest}</p>
            )}
          </div>

          {/* Preferred Date */}
          <div className="space-y-2">
            <Label htmlFor="preferred_date">Preferred Date *</Label>
            <Input
              id="preferred_date"
              type="date"
              value={formData.preferred_date}
              onChange={(e) => handleInputChange('preferred_date', e.target.value)}
              className={errors.preferred_date ? 'border-red-500' : ''}
              min={new Date().toISOString().split('T')[0]}
              required
            />
            {errors.preferred_date && (
              <p className="text-sm text-red-500">{errors.preferred_date}</p>
            )}
          </div>

          {/* Preferred Time */}
          <div className="space-y-2">
            <Label htmlFor="preferred_time">Preferred Time *</Label>
            <Input
              id="preferred_time"
              type="time"
              value={formData.preferred_time}
              onChange={(e) => handleInputChange('preferred_time', e.target.value)}
              className={errors.preferred_time ? 'border-red-500' : ''}
              required
            />
            {errors.preferred_time && (
              <p className="text-sm text-red-500">{errors.preferred_time}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Clinic hours: 09:00 - 18:00
            </p>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Book Appointment'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
