// Validation utility functions

export interface ValidationError {
  field: string;
  message: string;
}

// Validate phone number format (+62 with 10-15 digits)
export function validatePhoneNumber(phone: string): ValidationError | null {
  if (!phone) {
    return { field: 'phone_number', message: 'Phone number is required' };
  }
  
  if (!phone.startsWith('+62')) {
    return { field: 'phone_number', message: 'Phone number must start with +62' };
  }
  
  const digits = phone.replace('+62', '');
  if (digits.length < 10 || digits.length > 15) {
    return { field: 'phone_number', message: 'Phone number must have 10-15 digits after +62' };
  }
  
  if (!/^\d+$/.test(digits)) {
    return { field: 'phone_number', message: 'Phone number must contain only digits after +62' };
  }
  
  return null;
}

// Validate email format
export function validateEmail(email: string): ValidationError | null {
  // Email is optional - skip validation if empty
  if (!email || email.trim() === '') {
    return null;
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { field: 'email', message: 'Invalid email format' };
  }
  
  return null;
}

// Validate full name (min 3 characters)
export function validateFullName(name: string): ValidationError | null {
  if (!name) {
    return { field: 'full_name', message: 'Full name is required' };
  }
  
  if (name.trim().length < 3) {
    return { field: 'full_name', message: 'Full name must be at least 3 characters' };
  }
  
  return null;
}

// Validate service
export function validateService(service: string): ValidationError | null {
  if (!service) {
    return { field: 'service_interest', message: 'Service is required' };
  }
  
  const validServices = [
    'Laser Treatment',
    'Facial Brightening',
    'Acne Treatment',
    'Skin Rejuvenation',
    'Anti-Aging Treatment',
    'Chemical Peeling'
  ];
  
  if (!validServices.includes(service)) {
    return { field: 'service_interest', message: 'Invalid service selected' };
  }
  
  return null;
}

// Validate date (must not be in the past)
export function validateDate(dateStr: string): ValidationError | null {
  if (!dateStr) {
    return { field: 'preferred_date', message: 'Preferred date is required' };
  }
  
  const date = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (isNaN(date.getTime())) {
    return { field: 'preferred_date', message: 'Invalid date format' };
  }
  
  if (date < today) {
    return { field: 'preferred_date', message: 'Date cannot be in the past' };
  }
  
  return null;
}

// Validate time format (HH:mm)
export function validateTime(timeStr: string): ValidationError | null {
  if (!timeStr) {
    return { field: 'preferred_time', message: 'Preferred time is required' };
  }
  
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  if (!timeRegex.test(timeStr)) {
    return { field: 'preferred_time', message: 'Invalid time format. Use HH:mm format' };
  }
  
  return null;
}