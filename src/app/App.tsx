import { useState } from 'react';
import { LandingPage } from './components/landing/LandingPage';
import { BookingPage } from './components/booking/BookingPage';
import { ConfirmationPage } from './components/ConfirmationPage';
import { TestDashboard } from './components/TestDashboard';
import { Toaster } from './components/ui/sonner';
import { Button } from './components/ui/button';

type ViewMode = 'landing' | 'booking' | 'confirmation' | 'test';

interface BookingData {
  bookingId: string;
  patientName?: string;
  phoneNumber?: string;
  email?: string;
  service?: string;
  date?: string;
  time?: string;
  doctorName?: string;
  clinicName?: string;
}

export default function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('landing');
  const [bookingData, setBookingData] = useState<BookingData>({
    bookingId: ''
  });

  const handleBookingClick = () => {
    setViewMode('booking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBookingComplete = (id: string, data?: Partial<BookingData>) => {
    setBookingData({
      bookingId: id,
      ...data
    });
    setViewMode('confirmation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHome = () => {
    setViewMode('landing');
    setBookingData({ bookingId: '' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="size-full min-h-screen">
      {/* Landing Page View */}
      {viewMode === 'landing' && (
        <>
          <LandingPage onBookingClick={handleBookingClick} />
          
          {/* Floating Test Button (for development) */}
          <button
            onClick={() => setViewMode('test')}
            className="fixed bottom-6 right-6 bg-gray-900 text-white px-4 py-2 rounded-full shadow-lg hover:bg-gray-800 transition-all text-sm z-50"
          >
            🧪 Test Dashboard
          </button>
        </>
      )}

      {/* Booking Page View */}
      {viewMode === 'booking' && (
        <BookingPage 
          onBookingComplete={handleBookingComplete}
          onBack={handleBackToHome}
        />
      )}

      {/* Confirmation Page View */}
      {viewMode === 'confirmation' && (
        <ConfirmationPage
          bookingId={bookingData.bookingId}
          bookingDetails={bookingData}
          onBackToHome={handleBackToHome}
        />
      )}

      {/* Test Dashboard View */}
      {viewMode === 'test' && (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
          <div className="max-w-4xl mx-auto">
            {/* Close Button */}
            <div className="mb-6 flex justify-between items-center">
              <Button
                variant="ghost"
                onClick={handleBackToHome}
                className="group"
              >
                <svg className="size-4 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Home
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode('booking')}
              >
                Go to Booking Form
              </Button>
            </div>

            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Integration Test Dashboard
              </h1>
              <p className="text-lg text-gray-600">
                Test all backend integrations and connections
              </p>
            </div>

            {/* Test Dashboard */}
            <TestDashboard />
          </div>
        </div>
      )}

      <Toaster />
    </div>
  );
}