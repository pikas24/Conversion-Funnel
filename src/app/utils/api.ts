// API utility for frontend to communicate with backend

import { projectId, publicAnonKey } from '/utils/supabase/info';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-1a9814d3`;

export interface BookingData {
  full_name: string;
  phone_number: string;
  email: string;
  service_interest: string;
  preferred_date: string;
  preferred_time: string;
}

export interface BookingResponse {
  status: 'success' | 'error';
  booking_id?: string;
  error_code?: string;
  message?: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

/**
 * Create a new booking
 */
export async function createBooking(data: BookingData): Promise<BookingResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    
    if (!response.ok) {
      console.error('Booking API error:', result);
    }
    
    return result;
  } catch (error) {
    console.error('Network error while creating booking:', error);
    return {
      status: 'error',
      error_code: 'NETWORK_ERROR',
      message: 'Failed to connect to server. Please check your internet connection.',
    };
  }
}

/**
 * Check API health
 */
export async function checkHealth(): Promise<{ status: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
      },
    });

    return await response.json();
  } catch (error) {
    console.error('Health check failed:', error);
    return { status: 'error' };
  }
}
