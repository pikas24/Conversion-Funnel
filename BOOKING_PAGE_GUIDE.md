# Booking Page Guide - Multi-Step Premium Design

## 🎯 Overview

**Booking Page** dengan **Multi-Step Form** yang premium, focused, dan high-conversion untuk klinik estetika. Halaman ini mengikuti prinsip **"Structure is fixed, assets are replaceable"** dengan UX yang optimal untuk proses booking.

## 📋 Design Philosophy

### Core Principles

**1. Linearitas (Single Path)**
- User tidak berada dalam labirin navigasi
- Alur vertikal step-by-step yang jelas
- Fokus pada satu tujuan: menyelesaikan booking

**2. Fokus Visual Terpusat**
- No navigation menu
- No footer kompleks
- No distractions
- **Focused conversion page**

**3. Kejelasan Status**
- Progress indicator yang clear
- User selalu tahu: step berapa, apa yang sudah diisi, berapa langkah tersisa
- Visual feedback pada setiap input

**4. Nuansa Steril namun Ramah**
- Elite boutique medical aesthetic
- Calming, professional, trustworthy
- Human touch via doctor photos & warm colors

## 🎨 Design System

### Color Palette

```css
Primary:      Deep Emerald (#0d6e6e)
Hover:        Emerald Dark (#0a5555)
Background:   Very light neutral (#fafaf9)
Accent:       Soft gold / emerald highlight
Trust:        Green (for validation)
Error:        Red (for validation errors)
```

### Typography

**Headlines:** Cormorant Garamond (serif)
**Body & Labels:** Plus Jakarta Sans (sans-serif)

**Hierarchy:**
- H1: Page title (4xl-5xl)
- H2: Step titles (2xl)
- H3: Section headers
- Body: Form labels & descriptions (sm-base)

### Layout

**Single Column Layout** untuk:
- Meningkatkan fokus
- Memudahkan scanning
- Menghindari distraksi
- Mobile-first approach

## 📐 Page Structure

### Complete Structure:

```
┌─────────────────────────────────────────┐
│  Back Button                             │
├─────────────────────────────────────────┤
│  Page Header                             │
│  - Main title                            │
│  - Subtitle description                  │
├─────────────────────────────────────────┤
│  Step Indicator (Progress Bar)           │
│  - Visual progress                       │
│  - Step labels                           │
├─────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────────┐ │
│  │              │  │                  │ │
│  │   Doctor     │  │   Booking        │ │
│  │  Reference   │  │   Summary        │ │
│  │    Card      │  │   (Sidebar)      │ │
│  │              │  │                  │ │
│  ├──────────────┤  └──────────────────┘ │
│  │              │                       │
│  │  Multi-Step  │                       │
│  │    Form      │                       │
│  │              │                       │
│  │  Step 1-4    │                       │
│  │              │                       │
│  ├──────────────┤                       │
│  │ Navigation   │                       │
│  │ Prev | Next  │                       │
│  └──────────────┘                       │
└─────────────────────────────────────────┘
```

## 🔢 Multi-Step Form Flow

### Step 1: Personal Information

**Fields:**
- Full Name (required, min 3 chars)
- Phone Number (required, +62 format)
- Email (optional, but validated if provided)

**Features:**
- Auto-focus on first field
- Real-time validation
- Green checkmark on valid input
- Helper text for format guidance

**Validation:**
```typescript
Full Name:     Min 3 characters
Phone:         +62 + 9-13 digits
Email:         Standard email format (optional)
```

### Step 2: Service Selection

**Services Available:**
- Laser Treatment (From Rp 299.000)
- Facial Brightening (From Rp 199.000)
- Acne Treatment (From Rp 249.000)
- Skin Rejuvenation (From Rp 349.000)
- Anti-Aging Treatment (From Rp 399.000)
- Chemical Peeling (From Rp 279.000)

**Features:**
- Card-based selection
- Visual active state
- Checkmark on selected
- Price preview

### Step 3: Schedule (Date & Time)

**Date Selection:**
- Calendar date picker
- Min date: today
- No past dates allowed
- Visual feedback on selection

**Time Selection:**
- Grid of time slots
- Available times: 09:00 - 17:00
- 30-minute intervals
- Visual active state
- All times in WIB

**Time Slots:**
```
Morning:    09:00 - 11:30
Afternoon:  13:00 - 15:30
Evening:    16:00 - 17:00
```

### Step 4: Confirm & Additional Notes

**Features:**
- Booking review summary
- All details displayed
- Optional notes field (max 500 chars)
- Security trust signal
- Final confirmation button

**Review Shows:**
- Patient name
- Phone number
- Email (if provided)
- Selected service
- Formatted date
- Selected time

## 🎭 Interactive Components

### 1. Step Indicator

**Features:**
- Progress bar animation
- Step circles with numbers
- Completed steps show checkmark
- Current step highlighted
- Responsive labels

**States:**
- Completed: Green checkmark
- Current: Highlighted (emerald)
- Upcoming: Gray outline

**Implementation:**
```tsx
<StepIndicator 
  currentStep={currentStep} 
  totalSteps={4} 
  steps={STEPS} 
/>
```

### 2. Doctor Reference Card

**Shows:**
- Doctor photo (circular, with ring)
- Doctor name
- Specialty
- Rating (4.9 stars)
- Years of experience
- Clinic location
- Verified badge
- Trust message

**Purpose:**
- Build trust
- Show human element
- Reduce anxiety
- Professional credibility

**Implementation:**
```tsx
<DoctorReferenceCard
  doctorImage="url"
  doctorName="Dr. Name"
  specialty="Specialty"
  clinicName="Clinic"
  rating={4.9}
  yearsExperience={15}
/>
```

### 3. Booking Summary

**Live Updates:**
- Updates as user fills form
- Shows all collected data
- Displays estimated price
- Sticky on desktop
- Below form on mobile

**States:**
- Empty: Shows placeholder with icon
- Filled: Shows complete summary with checkmarks

**Features:**
- Doctor info
- Patient name
- Service selected
- Date & time
- Price estimate
- Security badge

**Implementation:**
```tsx
<BookingSummary
  data={{
    fullName: string,
    service: string,
    date: string,
    time: string,
    estimatedPrice: string
  }}
  doctorImage="url"
  doctorName="Dr. Name"
/>
```

## ✅ Real-Time Validation

### Validation Strategy

**Field-Level Validation:**
- Validates on blur
- Shows checkmark on valid
- Shows error message on invalid
- Prevents next step if invalid

**Visual Feedback:**
```
Valid:    Green checkmark icon
Invalid:  Red error message (not shown but prevented)
Empty:    No icon (neutral state)
```

**Validation Rules:**

| Field        | Rule                          | Error Prevention       |
|--------------|-------------------------------|------------------------|
| Full Name    | Min 3 chars                   | Cannot proceed to step 2 |
| Phone        | +62 + 9-13 digits             | Cannot proceed to step 2 |
| Email        | Valid format or empty         | Can proceed if empty   |
| Service      | Must select one               | Cannot proceed to step 3 |
| Date         | Today or future               | Cannot proceed to step 4 |
| Time         | Must select slot              | Cannot proceed to step 4 |

## 🎬 Animations & Interactions

### Scroll Animations

Using Motion (Framer Motion):
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
```

**Timing:**
- Page header: 0.5s
- Doctor card: 0.5s
- Form card: 0.5s + 0.1s delay
- Summary: 0.5s + 0.2s delay

### Step Transitions

**AnimatePresence for smooth transitions:**
```tsx
<AnimatePresence mode="wait">
  {currentStep === 1 && <Step1 />}
  {currentStep === 2 && <Step2 />}
  ...
</AnimatePresence>
```

**Transition:**
- Enter: Fade in + slide right (x: 20)
- Exit: Fade out + slide left (x: -20)
- Duration: 300ms

### Micro-Interactions

**Button Hover:**
- Subtle shadow increase
- Color darkening
- Smooth transition

**Input Focus:**
- Border color change to emerald
- Subtle glow effect
- Icon color change

**Time Slot Selection:**
- Background change
- Border color change
- Text color inversion

## 📱 Responsive Design

### Desktop (> 1024px)

```
Grid Layout:
┌──────────────────────┬────────────┐
│                      │            │
│   Main Content       │  Summary   │
│   (2/3 width)        │  Sidebar   │
│                      │  (1/3)     │
│                      │  (Sticky)  │
└──────────────────────┴────────────┘
```

### Tablet (768px - 1024px)

```
┌──────────────────────┬────────────┐
│   Main Content       │  Summary   │
│   (60%)              │  (40%)     │
└──────────────────────┴────────────┘
```

### Mobile (< 768px)

```
┌──────────────────────┐
│   Main Content       │
│   (Full width)       │
│                      │
├──────────────────────┤
│   Summary            │
│   (Below form)       │
└──────────────────────┘
```

**Mobile Optimizations:**
- Larger touch targets
- Full-width buttons
- Simplified step labels
- Time slots in 3 columns
- Sticky navigation bar

## 🔐 Security & Trust Elements

### Trust Signals

**1. Security Badge (Step 4)**
- Lock icon
- "Your data is encrypted & secure" message
- Green background for safety
- Industry-standard encryption mention

**2. Doctor Verification**
- Verified badge on doctor photo
- Years of experience
- Star rating
- Professional credentials

**3. Booking Summary**
- Checkmarks on completed items
- Secure data message
- Professional presentation

## 🎯 UX Best Practices Implemented

### 1. Progressive Disclosure
- One step at a time
- No overwhelming long forms
- Clear progress indication

### 2. Micro-copy Guidance
```
✅ "Pilih tanggal yang tersedia"
❌ "Pilih tanggal"

✅ "Format: +62 followed by your number"
❌ "Enter phone"
```

### 3. White Space
- Generous padding between fields (6-8)
- Large section spacing (12)
- Breathing room around cards
- Not cramped or dense

### 4. Visual Hierarchy
```
Page Title (largest)
  ↓
Step Title
  ↓
Field Labels
  ↓
Helper Text (smallest)
```

### 5. Instant Feedback
- Real-time validation
- Checkmarks on valid input
- Disabled next button if invalid
- Clear error prevention

### 6. Mobile-First
- Touch-friendly targets (min 44px)
- Large input fields
- Simplified navigation
- Optimized time slot grid

## 🚀 Performance Optimizations

### Code Splitting
- Components lazy loaded
- Animations GPU-accelerated
- Form validation optimized

### Image Optimization
- Doctor photo properly sized
- Lazy loading for images
- Optimized aspect ratios

### State Management
- Minimal re-renders
- Efficient validation checks
- Optimized form updates

## 📊 Integration with Backend

### API Call (Step 4)

```typescript
POST /api/bookings

Body:
{
  full_name: string,
  phone_number: string,
  email?: string,
  service_interest: string,
  preferred_date: string (YYYY-MM-DD),
  preferred_time: string (HH:mm),
  notes?: string
}

Response:
{
  status: "success",
  booking_id: string
}
```

### Flow After Submission

```
User clicks "Confirm Booking"
         ↓
Form validates all fields
         ↓
Submit button shows "Processing..."
         ↓
API call to backend
         ↓
Creates Lead + Appointment
         ↓
Sends Telegram + Email notifications
         ↓
Returns booking_id
         ↓
Redirect to Confirmation Page
```

## 🎨 Customization Guide

### Change Colors

**Primary Color:**
```css
Find: bg-[#0d6e6e]
Replace: bg-[#YOUR_COLOR]

Find: text-[#0d6e6e]
Replace: text-[#YOUR_COLOR]
```

**Update in files:**
- BookingPage.tsx
- StepIndicator.tsx
- DoctorReferenceCard.tsx
- BookingSummary.tsx

### Change Doctor Info

**In BookingPage.tsx:**
```tsx
<DoctorReferenceCard
  doctorImage="YOUR_IMAGE_URL"
  doctorName="YOUR_DOCTOR_NAME"
  specialty="YOUR_SPECIALTY"
  clinicName="YOUR_CLINIC"
  rating={YOUR_RATING}
  yearsExperience={YEARS}
/>
```

### Change Services

**In BookingPage.tsx:**
```typescript
const SERVICES = [
  { 
    value: 'service_id', 
    label: 'Service Name', 
    price: 'From Rp XXX.XXX' 
  },
  // Add more services
];
```

### Change Time Slots

**In BookingPage.tsx:**
```typescript
const TIME_SLOTS = [
  '09:00', '10:00', '11:00', // etc
];
```

## 🧪 Testing Checklist

### Step Navigation
- [ ] Can navigate forward through all steps
- [ ] Can navigate backward
- [ ] Cannot proceed with invalid data
- [ ] Step indicator updates correctly
- [ ] Progress bar animates smoothly

### Validation
- [ ] Full name requires 3+ chars
- [ ] Phone requires +62 format
- [ ] Email validates correctly (or empty)
- [ ] Service must be selected
- [ ] Date cannot be in past
- [ ] Time must be selected
- [ ] Checkmarks appear on valid input

### Responsiveness
- [ ] Works on mobile (< 768px)
- [ ] Works on tablet (768-1024px)
- [ ] Works on desktop (> 1024px)
- [ ] Summary sidebar sticky on desktop
- [ ] Summary below form on mobile
- [ ] Touch targets large enough

### Animations
- [ ] Step transitions smooth
- [ ] Progress bar animates
- [ ] Micro-interactions work
- [ ] No jank or stutter

### Integration
- [ ] Submits to backend correctly
- [ ] Shows loading state
- [ ] Handles errors gracefully
- [ ] Redirects to confirmation on success
- [ ] Booking ID is captured

## 📖 Component Props Reference

### BookingPage

```tsx
interface BookingPageProps {
  onBookingComplete: (bookingId: string) => void;
  onBack: () => void;
}
```

### StepIndicator

```tsx
interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  steps: Array<{
    number: number;
    title: string;
    description: string;
  }>;
}
```

### DoctorReferenceCard

```tsx
interface DoctorReferenceCardProps {
  doctorImage?: string;
  doctorName?: string;
  specialty?: string;
  clinicName?: string;
  rating?: number;
  yearsExperience?: number;
}
```

### BookingSummary

```tsx
interface BookingSummaryProps {
  data: {
    fullName?: string;
    service?: string;
    date?: string;
    time?: string;
    estimatedPrice?: string;
  };
  doctorImage?: string;
  doctorName?: string;
}
```

## 🎯 Key Takeaways

**Design Philosophy:**
> "The best form is the one that doesn't feel like a form"

**UX Principles:**
1. **One thing at a time** - Multi-step reduces cognitive load
2. **Show progress** - Users need to see how far they've come
3. **Instant feedback** - Real-time validation prevents errors
4. **Build trust** - Doctor card + security signals reduce anxiety
5. **Be forgiving** - Allow going back, no data loss

**Conversion Psychology:**
```
Trust (Doctor) → Ease (Simple form) → Safety (Validation) → Completion
```

---

**Status:** ✅ PRODUCTION READY

**Implementation:** Complete multi-step booking flow with premium UX

**Result:** High-conversion booking page that feels professional, trustworthy, and easy to use.
