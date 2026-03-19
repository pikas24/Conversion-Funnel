// Booking validation layer

import {
  validatePhoneNumber,
  validateEmail,
  validateFullName,
  validateService,
  validateDate,
  validateTime,
  ValidationError
} from './validation.utils.tsx';

export interface BookingRequest {
  full_name: string;
  phone_number: string;
  email: string;
  service_interest: string;
  preferred_date: string;
  preferred_time: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

export function validateBookingRequest(data: BookingRequest): ValidationResult {
  const errors: ValidationError[] = [];

  // Validate full name
  const nameError = validateFullName(data.full_name);
  if (nameError) errors.push(nameError);

  // Validate phone number
  const phoneError = validatePhoneNumber(data.phone_number);
  if (phoneError) errors.push(phoneError);

  // Validate email
  const emailError = validateEmail(data.email);
  if (emailError) errors.push(emailError);

  // Validate service
  const serviceError = validateService(data.service_interest);
  if (serviceError) errors.push(serviceError);

  // Validate date
  const dateError = validateDate(data.preferred_date);
  if (dateError) errors.push(dateError);

  // Validate time
  const timeError = validateTime(data.preferred_time);
  if (timeError) errors.push(timeError);

  return {
    valid: errors.length === 0,
    errors
  };
}
