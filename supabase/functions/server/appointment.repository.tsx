// Appointment repository layer - handles database operations for Appointments

import { createRecord, APPOINTMENTS_TABLE_ID } from './airtable.config.tsx';

export interface CreateAppointmentData {
  lead_id: string;
  requested_service: string;
  preferred_date: string;
  preferred_time: string;
  appointment_status: string;
}

export interface AppointmentRecord {
  id: string;
  lead_id: string[];
  requested_service: string;
  preferred_date: string;
  preferred_time: string;
  appointment_status: string;
  created_at: string;
}

// Create a new appointment in Airtable
export async function createAppointment(data: CreateAppointmentData): Promise<AppointmentRecord> {
  try {
    console.log('Creating appointment in Airtable:', data);
    
    const fields = {
      lead_id: [data.lead_id], // Airtable expects array for linked records
      requested_service: data.requested_service,
      preferred_date: data.preferred_date,
      preferred_time: data.preferred_time,
      appointment_status: data.appointment_status,
      created_at: new Date().toISOString(),
    };

    const response = await createRecord(APPOINTMENTS_TABLE_ID, fields);
    
    console.log('Appointment created successfully:', response.id);

    return {
      id: response.id,
      lead_id: response.fields.lead_id || [],
      requested_service: response.fields.requested_service,
      preferred_date: response.fields.preferred_date,
      preferred_time: response.fields.preferred_time,
      appointment_status: response.fields.appointment_status,
      created_at: response.fields.created_at,
    };
  } catch (error) {
    console.error('Error creating appointment in repository:', error);
    throw new Error(`Failed to create appointment: ${error.message}`);
  }
}
