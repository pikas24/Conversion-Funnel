// Booking service layer - handles business logic

import { BookingRequest } from './booking.validator.tsx';
import { createLead, calculateLeadScore } from './lead.repository.tsx';
import { createAppointment } from './appointment.repository.tsx';
import { handleBookingCreated } from './booking.trigger.tsx';

export interface BookingResponse {
  status: 'success' | 'error';
  booking_id?: string;
  error_code?: string;
  message?: string;
}

// Main booking workflow
export async function processBooking(data: BookingRequest): Promise<BookingResponse> {
  try {
    console.log('Processing booking workflow for:', data.full_name);
    
    // Step 1: Create Lead
    const leadData = {
      full_name: data.full_name,
      phone_number: data.phone_number,
      email: data.email,
      service_interest: data.service_interest,
      source: 'landing_page',
      status: 'New',
      lead_score: 0, // Will be calculated
    };
    
    // Calculate lead score
    leadData.lead_score = calculateLeadScore(leadData);
    console.log(`Calculated lead score: ${leadData.lead_score}`);
    
    // Create lead in database
    const lead = await createLead(leadData);
    console.log('Lead created with ID:', lead.id);
    
    // Step 2: Create Appointment
    const appointmentData = {
      lead_id: lead.id,
      requested_service: data.service_interest,
      preferred_date: data.preferred_date,
      preferred_time: data.preferred_time,
      appointment_status: 'Pending',
    };
    
    const appointment = await createAppointment(appointmentData);
    console.log('Appointment created with ID:', appointment.id);
    
    // Step 3: Trigger booking_created event
    const bookingEvent = {
      lead: {
        id: lead.id,
        full_name: lead.full_name,
        phone_number: lead.phone_number,
        email: lead.email,
      },
      appointment: {
        id: appointment.id,
        requested_service: appointment.requested_service,
        preferred_date: appointment.preferred_date,
        preferred_time: appointment.preferred_time,
      },
    };
    
    // Fire and continue - don't wait for notifications
    handleBookingCreated(bookingEvent).catch(error => {
      console.error('Error in booking automation (non-blocking):', error);
    });
    
    // Step 4: Return success response
    return {
      status: 'success',
      booking_id: appointment.id,
    };
    
  } catch (error) {
    console.error('Error processing booking in service layer:', error);
    
    return {
      status: 'error',
      error_code: 'INTERNAL_SERVER_ERROR',
      message: `Unexpected server error: ${error.message}`,
    };
  }
}
