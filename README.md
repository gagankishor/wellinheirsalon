# Wellins Hair Salon – Management System

A full-featured salon management system built with **Next.js** and **MongoDB**.

## Features

### Appointment Management
- **Online booking** – Public page at `/booking` for customers to book appointments
- **Walk-in entry** – Create appointments from the dashboard calendar (day view: click a slot)
- **Calendar** – Daily, weekly, and monthly views with staff filter
- **Staff-wise schedule** – Filter appointments by staff
- **Reschedule / Cancel** – Update status or cancel from the appointment detail modal
- **Recurring bookings** – Create recurring appointments (daily/weekly/biweekly/monthly) via API
- **Slot availability** – Auto slot check used by the booking flow and availability API

### Customer Management
- **Profiles** – Name, phone, email, birthday, anniversary
- **Service history** – From completed appointments
- **Preferred stylist** – Stored on customer and shown in list/detail

### Staff Management
- **Employee profiles** – Name, email, phone, role, commission %, base salary
- **Commission** – Per-service commission %; when an appointment is marked **completed**, a `ServiceRecord` is created and commission is calculated
- **Performance** – Staff detail page shows this month’s revenue and salary (base + commission)

### Reports & Analytics
- **Revenue** – Daily or monthly revenue (from completed appointments / service records)
- **Top services** – By count and revenue
- **Top staff** – By revenue and count

### Reminders & WhatsApp
- **WhatsApp API** – Optional integration for appointment reminders
- **Reminder API** – `POST /api/reminders/send` with optional `{ appointmentId }` to send one reminder, or no body to send due reminders (e.g. cron)
- Configure `WHATSAPP_PHONE_ID` and `WHATSAPP_ACCESS_TOKEN` in `.env.local` (see `.env.local.example`)

### Authentication
- **Super admin** – Full dashboard: appointments, customers, staff, services, reports, settings. Create the first admin at **/setup** (one-time only).
- **Staff login** – Staff can sign in to **check in / check out** and view **My Appointments**. Super admin creates a staff login from Staff → [staff name] → “Create login” (set password; staff uses their **email** from the Staff profile to sign in).
- **Login** at `/login`. Dashboard routes require sign-in; staff are restricted to Home, Check In/Out, and My Appointments.

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment**
   - Copy `.env.local.example` to `.env.local`
   - Set `MONGODB_URI` (e.g. `mongodb://localhost:27017/wellins-salon` or a MongoDB Atlas connection string)
   - Set `AUTH_SECRET` (run `npx auth secret` to generate one)
   - Optionally set WhatsApp variables for reminders

3. **Run**
   ```bash
   npm run dev
   ```

4. **First-time: create super admin**
   - Open [http://localhost:3000/setup](http://localhost:3000/setup)
   - Enter email and password (min 6 characters). This creates the first (and only) super admin account.
   - Then sign in at [http://localhost:3000/login](http://localhost:3000/login)

5. **URLs**
   - Home: [http://localhost:3000](http://localhost:3000)
   - Login: [http://localhost:3000/login](http://localhost:3000/login)
   - Dashboard: [http://localhost:3000/dashboard](http://localhost:3000/dashboard) (requires login)
   - Public booking: [http://localhost:3000/booking](http://localhost:3000/booking)

## Data to Add First

After signing in as super admin, add at least:
- **Services** – Dashboard → Services → Add service (name, duration, price)
- **Staff** – Dashboard → Staff → Add staff (name, email, phone, role, commission %, optional base salary). Then open a staff profile and click **Create login** to let them sign in.
- **Customers** – Dashboard → Customers → Add customer (or they are created when booking online)

Then you can create appointments (walk-in from Appointments calendar or via Online Booking).

## Tech Stack

- **Next.js 16** (App Router)
- **MongoDB** with **Mongoose**
- **Tailwind CSS**
- **TypeScript**
- **date-fns**, **lucide-react**
- **NextAuth** (credentials + JWT), **bcryptjs**

## API Overview

| Route | Method | Description |
|-------|--------|-------------|
| `/api/services` | GET, POST | List / create services |
| `/api/staff` | GET, POST | List / create staff |
| `/api/customers` | GET, POST | List / create customers (GET supports `?q=`) |
| `/api/customers/[id]` | GET, PATCH | Get / update customer |
| `/api/appointments` | GET, POST | List / create appointments (GET: `from`, `to`, `staffId`, `customerId`, `status`) |
| `/api/appointments/availability` | GET | Slots for a date (`date`, `staffId?`, `duration`) |
| `/api/appointments/[id]` | GET, PATCH, DELETE | Get / update / cancel appointment |
| `/api/reports/revenue` | GET | `period=day|month`, `date` (YYYY-MM-DD or YYYY-MM) |
| `/api/reports/top-services` | GET | `months=1` |
| `/api/reports/top-staff` | GET | `months=1` |
| `/api/reminders/send` | POST | Send WhatsApp reminder(s) |
| `/api/auth/setup` | GET | `{ needsSetup }` – true if no users. POST with `{ email, password }` to create first super admin (once only) |
| `/api/auth/create-staff-login` | POST | Super admin: `{ staffId, password }` to create staff login |
| `/api/attendance/me` | GET | Staff: today’s attendance `?date=YYYY-MM-DD` |
| `/api/attendance/check-in` | POST | Staff: check in |
| `/api/attendance/check-out` | POST | Staff: check out |

## Recurring Appointments

Send `POST /api/appointments` with a `recurrence` object, for example:

```json
{
  "customerId": "...",
  "staffId": "...",
  "serviceId": "...",
  "startTime": "2025-03-15T10:00:00.000Z",
  "endTime": "2025-03-15T11:00:00.000Z",
  "recurrence": {
    "frequency": "weekly",
    "endDate": "2025-06-15",
    "interval": 1
  }
}
```

This creates one appointment per occurrence. Supported `frequency`: `daily`, `weekly`, `biweekly`, `monthly`.
