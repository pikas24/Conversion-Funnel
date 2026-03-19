// Lead repository layer - handles database operations for Leads

import { createRecord, LEADS_TABLE_ID } from './airtable.config.tsx';

export interface CreateLeadData {
  full_name: string;
  phone_number: string;
  email: string;
  service_interest: string;
  source: string;
  status: string;
  lead_score: number;
}

export interface LeadRecord {
  id: string;
  full_name: string;
  phone_number: string;
  email: string;
  service_interest: string;
  status: string;
  source: string;
  lead_score: number;
  created_at: string;
}

// Create a new lead in Airtable
export async function createLead(data: CreateLeadData): Promise<LeadRecord> {
  try {
    console.log('Creating lead in Airtable:', data);
    
    const fields = {
      full_name: data.full_name,
      phone_number: data.phone_number,
      email: data.email,
      service_interest: data.service_interest,
      status: data.status,
      source: data.source,
      lead_score: data.lead_score,
      created_at: new Date().toISOString(),
    };

    const response = await createRecord(LEADS_TABLE_ID, fields);
    
    console.log('Lead created successfully:', response.id);

    return {
      id: response.id,
      full_name: response.fields.full_name,
      phone_number: response.fields.phone_number,
      email: response.fields.email,
      service_interest: response.fields.service_interest,
      status: response.fields.status,
      source: response.fields.source,
      lead_score: response.fields.lead_score,
      created_at: response.fields.created_at,
    };
  } catch (error) {
    console.error('Error creating lead in repository:', error);
    throw new Error(`Failed to create lead: ${error.message}`);
  }
}

// Calculate lead score based on various factors
export function calculateLeadScore(data: CreateLeadData): number {
  let score = 50; // Base score
  
  // Email provided (+10 points)
  if (data.email && data.email.length > 0) {
    score += 10;
  }
  
  // Valid phone number (+10 points)
  if (data.phone_number && data.phone_number.startsWith('+62')) {
    score += 10;
  }
  
  // High-value services (+20 points)
  const highValueServices = ['Laser Treatment', 'Skin Rejuvenation', 'Anti-Aging Treatment'];
  if (highValueServices.includes(data.service_interest)) {
    score += 20;
  }
  
  // From landing page (+10 points - more intent)
  if (data.source === 'landing_page') {
    score += 10;
  }
  
  return Math.min(score, 100); // Cap at 100
}
