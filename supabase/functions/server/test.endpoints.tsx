// Test endpoints untuk verifikasi integrasi

import { Context } from "npm:hono";
import { createRecord, LEADS_TABLE_ID, APPOINTMENTS_TABLE_ID } from './airtable.config.tsx';
import { sendTelegramNotification, sendEmailNotification } from './booking.trigger.tsx';

// Test Airtable connection
export async function testAirtableConnection(c: Context) {
  try {
    console.log('Testing Airtable connection...');
    
    // Test create lead
    const testLead = {
      full_name: `TEST Lead - ${new Date().toISOString()}`,
      phone_number: '+6281234567890',
      email: 'test@example.com',
      service_interest: 'Laser Treatment',
      status: 'New',
      source: 'landing_page',
      lead_score: 75,
      created_at: new Date().toISOString(),
    };
    
    const leadResult = await createRecord(LEADS_TABLE_ID, testLead);
    console.log('✅ Airtable Lead created:', leadResult.id);
    
    // Test create appointment linked to lead
    const testAppointment = {
      lead_id: [leadResult.id],
      requested_service: 'Laser Treatment',
      preferred_date: '2026-04-15',
      preferred_time: '10:00',
      appointment_status: 'Pending',
      created_at: new Date().toISOString(),
    };
    
    const appointmentResult = await createRecord(APPOINTMENTS_TABLE_ID, testAppointment);
    console.log('✅ Airtable Appointment created:', appointmentResult.id);
    
    return c.json({
      status: 'success',
      service: 'Airtable',
      message: 'Connection successful',
      data: {
        lead_id: leadResult.id,
        appointment_id: appointmentResult.id,
        lead_fields: leadResult.fields,
        appointment_fields: appointmentResult.fields,
      }
    });
    
  } catch (error) {
    console.error('❌ Airtable test failed:', error);
    return c.json({
      status: 'error',
      service: 'Airtable',
      message: error.message,
      error: error.toString()
    }, 500);
  }
}

// Test Telegram connection
export async function testTelegramConnection(c: Context) {
  try {
    console.log('Testing Telegram connection...');
    
    const testEvent = {
      lead: {
        id: 'test_lead_123',
        full_name: 'TEST User - Connection Test',
        phone_number: '+6281234567890',
        email: 'test@example.com',
      },
      appointment: {
        id: 'test_apt_123',
        requested_service: 'Laser Treatment',
        preferred_date: '2026-04-15',
        preferred_time: '10:00',
      }
    };
    
    await sendTelegramNotification(testEvent);
    console.log('✅ Telegram notification sent');
    
    return c.json({
      status: 'success',
      service: 'Telegram',
      message: 'Test notification sent successfully',
      note: 'Check your Telegram group for the test message'
    });
    
  } catch (error) {
    console.error('❌ Telegram test failed:', error);
    return c.json({
      status: 'error',
      service: 'Telegram',
      message: error.message,
      error: error.toString()
    }, 500);
  }
}

// Test Resend (Email) connection
export async function testResendConnection(c: Context) {
  try {
    console.log('Testing Resend email connection...');
    
    const testEvent = {
      lead: {
        id: 'test_lead_123',
        full_name: 'TEST User - Email Test',
        phone_number: '+6281234567890',
        email: 'test@example.com',
      },
      appointment: {
        id: 'test_apt_123',
        requested_service: 'Laser Treatment',
        preferred_date: '2026-04-15',
        preferred_time: '10:00',
      }
    };
    
    await sendEmailNotification(testEvent);
    console.log('✅ Email notification sent');
    
    return c.json({
      status: 'success',
      service: 'Resend (Email)',
      message: 'Test email sent successfully',
      note: 'Check your email inbox for the test message'
    });
    
  } catch (error) {
    console.error('❌ Resend email test failed:', error);
    return c.json({
      status: 'error',
      service: 'Resend (Email)',
      message: error.message,
      error: error.toString()
    }, 500);
  }
}

// Test all integrations
export async function testAllIntegrations(c: Context) {
  const results = {
    airtable: null,
    telegram: null,
    email: null,
  };
  
  // Test Airtable
  try {
    console.log('Testing Airtable...');
    const testLead = {
      full_name: `FULL TEST - ${new Date().toISOString()}`,
      phone_number: '+6281234567890',
      email: 'fulltest@example.com',
      service_interest: 'Facial Brightening',
      status: 'New',
      source: 'landing_page',
      lead_score: 85,
      created_at: new Date().toISOString(),
    };
    
    const leadResult = await createRecord(LEADS_TABLE_ID, testLead);
    const appointmentResult = await createRecord(APPOINTMENTS_TABLE_ID, {
      lead_id: [leadResult.id],
      requested_service: 'Facial Brightening',
      preferred_date: '2026-04-20',
      preferred_time: '14:30',
      appointment_status: 'Pending',
      created_at: new Date().toISOString(),
    });
    
    results.airtable = {
      status: 'success',
      lead_id: leadResult.id,
      appointment_id: appointmentResult.id
    };
    
    // Use created data for notifications
    const testEvent = {
      lead: {
        id: leadResult.id,
        full_name: testLead.full_name,
        phone_number: testLead.phone_number,
        email: testLead.email,
      },
      appointment: {
        id: appointmentResult.id,
        requested_service: 'Facial Brightening',
        preferred_date: '2026-04-20',
        preferred_time: '14:30',
      }
    };
    
    // Test Telegram
    try {
      await sendTelegramNotification(testEvent);
      results.telegram = { status: 'success' };
    } catch (error) {
      results.telegram = { status: 'error', message: error.message };
    }
    
    // Test Email
    try {
      await sendEmailNotification(testEvent);
      results.email = { status: 'success' };
    } catch (error) {
      results.email = { status: 'error', message: error.message };
    }
    
  } catch (error) {
    results.airtable = { status: 'error', message: error.message };
  }
  
  const allSuccess = results.airtable?.status === 'success' && 
                     results.telegram?.status === 'success' && 
                     results.email?.status === 'success';
  
  return c.json({
    status: allSuccess ? 'success' : 'partial',
    message: allSuccess ? 'All integrations working!' : 'Some integrations failed',
    results: results
  });
}

// Check environment variables
export async function checkEnvironmentVariables(c: Context) {
  const envCheck = {
    airtable: {
      AIRTABLE_API_KEY: !!Deno.env.get('AIRTABLE_API_KEY'),
      AIRTABLE_BASE_ID: !!Deno.env.get('AIRTABLE_BASE_ID'),
      AIRTABLE_LEADS_TABLE_ID: !!Deno.env.get('AIRTABLE_LEADS_TABLE_ID'),
      AIRTABLE_BOOKINGS_TABLE_ID: !!Deno.env.get('AIRTABLE_BOOKINGS_TABLE_ID'),
    },
    telegram: {
      TELEGRAM_BOT_TOKEN: !!Deno.env.get('TELEGRAM_BOT_TOKEN'),
      TELEGRAM_ADMIN_CHAT_ID: !!Deno.env.get('TELEGRAM_ADMIN_CHAT_ID'),
    },
    email: {
      RESEND_API_KEY: !!Deno.env.get('RESEND_API_KEY'),
      RESEND_TO_EMAIL: !!Deno.env.get('RESEND_TO_EMAIL'),
    },
    supabase: {
      SUPABASE_URL: !!Deno.env.get('SUPABASE_URL'),
      SUPABASE_ANON_KEY: !!Deno.env.get('SUPABASE_ANON_KEY'),
      SUPABASE_SERVICE_ROLE_KEY: !!Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'),
    }
  };
  
  const allConfigured = Object.values(envCheck).every(service => 
    Object.values(service).every(value => value === true)
  );
  
  return c.json({
    status: allConfigured ? 'success' : 'incomplete',
    message: allConfigured ? 'All environment variables configured' : 'Some variables missing',
    variables: envCheck
  });
}
