// Airtable configuration and client

const AIRTABLE_API_KEY = Deno.env.get('AIRTABLE_API_KEY') || '';
const AIRTABLE_BASE_ID = Deno.env.get('AIRTABLE_BASE_ID') || '';
const AIRTABLE_LEADS_TABLE_ID = Deno.env.get('AIRTABLE_LEADS_TABLE_ID') || '';
const AIRTABLE_BOOKINGS_TABLE_ID = Deno.env.get('AIRTABLE_BOOKINGS_TABLE_ID') || '';

const AIRTABLE_API_URL = 'https://api.airtable.com/v0';

export interface AirtableRecord {
  id?: string;
  fields: Record<string, any>;
  createdTime?: string;
}

export interface AirtableResponse {
  id: string;
  fields: Record<string, any>;
  createdTime: string;
}

// Create a record in Airtable
export async function createRecord(
  tableId: string,
  fields: Record<string, any>
): Promise<AirtableResponse> {
  const url = `${AIRTABLE_API_URL}/${AIRTABLE_BASE_ID}/${tableId}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ fields }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error(`Airtable API error while creating record in ${tableId}:`, error);
    throw new Error(`Failed to create record in Airtable: ${error}`);
  }

  return await response.json();
}

// Get a record from Airtable
export async function getRecord(
  tableId: string,
  recordId: string
): Promise<AirtableResponse> {
  const url = `${AIRTABLE_API_URL}/${AIRTABLE_BASE_ID}/${tableId}/${recordId}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    console.error(`Airtable API error while getting record from ${tableId}:`, error);
    throw new Error(`Failed to get record from Airtable: ${error}`);
  }

  return await response.json();
}

// Update a record in Airtable
export async function updateRecord(
  tableId: string,
  recordId: string,
  fields: Record<string, any>
): Promise<AirtableResponse> {
  const url = `${AIRTABLE_API_URL}/${AIRTABLE_BASE_ID}/${tableId}/${recordId}`;
  
  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ fields }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error(`Airtable API error while updating record in ${tableId}:`, error);
    throw new Error(`Failed to update record in Airtable: ${error}`);
  }

  return await response.json();
}

export const LEADS_TABLE_ID = AIRTABLE_LEADS_TABLE_ID;
export const APPOINTMENTS_TABLE_ID = AIRTABLE_BOOKINGS_TABLE_ID;
