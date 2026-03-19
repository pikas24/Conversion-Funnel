import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { validateBookingRequest, BookingRequest } from "./booking.validator.tsx";
import { processBooking } from "./booking.service.tsx";
import { 
  testAirtableConnection, 
  testTelegramConnection, 
  testResendConnection,
  testAllIntegrations,
  checkEnvironmentVariables 
} from "./test.endpoints.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-1a9814d3/health", (c) => {
  return c.json({ status: "ok" });
});

// Test endpoints
app.get("/make-server-1a9814d3/test/env", checkEnvironmentVariables);
app.get("/make-server-1a9814d3/test/airtable", testAirtableConnection);
app.get("/make-server-1a9814d3/test/telegram", testTelegramConnection);
app.get("/make-server-1a9814d3/test/email", testResendConnection);
app.get("/make-server-1a9814d3/test/all", testAllIntegrations);

// Booking endpoint - POST /api/bookings
app.post("/make-server-1a9814d3/api/bookings", async (c) => {
  try {
    console.log('=== Booking API Request Received ===');
    
    // Parse request body
    const body: BookingRequest = await c.req.json();
    console.log('Request payload:', body);
    
    // Validate request data
    const validationResult = validateBookingRequest(body);
    
    if (!validationResult.valid) {
      console.log('Validation failed:', validationResult.errors);
      // Extract first error message as string
      const firstError = validationResult.errors[0];
      const errorMessage = firstError?.message || 'Data tidak valid';
      
      return c.json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: errorMessage, // Return string, not object
      }, 422);
    }
    
    console.log('Validation passed, processing booking...');
    
    // Process booking through service layer
    const result = await processBooking(body);
    
    if (result.status === 'error') {
      console.error('Booking processing failed:', result);
      return c.json({
        success: false,
        error: 'SERVER_ERROR',
        message: result.message || 'Terjadi kesalahan pada sistem',
      }, 500);
    }
    
    console.log('Booking processed successfully:', result.booking_id);
    
    // Return success response according to Phase 3 documentation
    return c.json({
      success: true,
      message: 'Booking request berhasil dikirim',
      data: {
        lead_id: result.lead_id,
        appointment_id: result.appointment_id,
        booking_id: result.booking_id
      }
    }, 200);
    
  } catch (error) {
    console.error('Unexpected error in booking endpoint:', error);
    return c.json({
      success: false,
      error: 'SERVER_ERROR',
      message: 'Terjadi kesalahan pada sistem',
    }, 500);
  }
});

// Alias endpoint for Phase 3 documentation compatibility
// POST /api/book-appointment (same handler as /api/bookings)
app.post("/make-server-1a9814d3/api/book-appointment", async (c) => {
  try {
    console.log('=== Booking API Request Received (book-appointment alias) ===');
    
    // Parse request body
    const body: BookingRequest = await c.req.json();
    console.log('Request payload:', body);
    
    // Validate request data
    const validationResult = validateBookingRequest(body);
    
    if (!validationResult.valid) {
      console.log('Validation failed:', validationResult.errors);
      // Extract first error message as string
      const firstError = validationResult.errors[0];
      const errorMessage = firstError?.message || 'Data tidak valid';
      
      return c.json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: errorMessage, // Return string, not object
      }, 422);
    }
    
    console.log('Validation passed, processing booking...');
    
    // Process booking through service layer
    const result = await processBooking(body);
    
    if (result.status === 'error') {
      console.error('Booking processing failed:', result);
      return c.json({
        success: false,
        error: 'SERVER_ERROR',
        message: result.message || 'Terjadi kesalahan pada sistem',
      }, 500);
    }
    
    console.log('Booking processed successfully:', result.booking_id);
    
    // Return success response according to Phase 3 documentation
    return c.json({
      success: true,
      message: 'Booking request berhasil dikirim',
      data: {
        lead_id: result.lead_id,
        appointment_id: result.appointment_id,
        booking_id: result.booking_id
      }
    }, 200);
    
  } catch (error) {
    console.error('Unexpected error in booking endpoint:', error);
    return c.json({
      success: false,
      error: 'SERVER_ERROR',
      message: 'Terjadi kesalahan pada sistem',
    }, 500);
  }
});

Deno.serve(app.fetch);