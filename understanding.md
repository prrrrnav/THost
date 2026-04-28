# Project Understanding: THost

THost is a comprehensive **Multi-Tenant PG (Paying Guest) Management Platform** designed to streamline operations for PG owners across India. It provides a centralized dashboard for owners to manage residents, track finances, and handle maintenance, while giving tenants a dedicated portal for payments and communication.

---

## 🚀 Core Personas

### 1. Admin (PG Owner)
The primary user who manages one or more PG properties.
- **Tenant Management**: Onboard tenants, assign rooms, and track documentation.
- **Financial Oversight**: Track rent payments, calculate profits, manage utility bills (electricity), and monitor expenses.
- **Facility Management**: Update food menus, manage room inventory, and resolve tenant complaints.
- **Payment Integration**: Configure Paytm merchant credentials for automated rent collection.

### 2. Tenant (Resident)
The resident living in the PG.
- **Payment Portal**: View current rent status, download receipts, and pay rent online.
- **Communication**: Raise maintenance complaints and view official PG notifications.
- **Daily Life**: Check the daily food menu and view PG rules.

### 3. Super Admin
The platform owner managing the SaaS infrastructure.
- **Owner Onboarding**: Approve and manage PG owners on the platform.
- **Platform Analytics**: Monitor global revenue and system health.
- **SaaS Management**: Handle subscriptions and platform-wide settings.

---

## 🛠️ Technology Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, Server Actions)
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL)
- **Auth**: Supabase Auth (Email/Password & Role-based access)
- **Styling**: Tailwind CSS & Radix UI (Shadcn/ui)
- **Icons**: Lucide React
- **Payments**: Paytm Integration (via `paytmchecksum`)
- **Validation**: Zod (for form schemas and API safety)

---

## 🗄️ Database Architecture (Supabase)

The project uses a structured PostgreSQL schema in the `public` namespace. Below are the key tables and their relationships:

### Core Tables
| Table | Description |
|-------|-------------|
| `profiles` | Unified user table linking Supabase Auth IDs to roles (`admin`, `tenant`, `superadmin`). |
| `pg_owners` | Detailed info for owners, including Paytm `mid` and `merchant_key`. |
| `pg_details` | Basic PG property info (name, address) and `joining_code` for tenants. |
| `tenants` | Resident data, including `room_number`, `rent_amount`, and `due_date`. |
| `rooms` | Inventory management (capacity, current occupancy, base rent). |
| `payments` | Transaction logs including `paytm_order_id`, `status` (Paid/Overdue), and `penalty_amount`. |

### Management Tables
- `electricity_bills`: Tracking utility costs per unit/shop.
- `complaints`: Maintenance ticket system with statuses (Pending/Resolved).
- `menu_items`: Weekly food schedule (`meal_type`, `day_of_week`).
- `expenses`: General operational costs for the PG.
- `notifications`: App-wide alerts for tenants/owners.

---

## 🧠 AI & Supabase MCP Integration

This project is connected to the **Supabase MCP**, allowing AI agents (like me) to interact deeply with the codebase and database:

1.  **Schema Awareness**: I can query the `information_schema` to understand the database structure in real-time.
2.  **Data Analysis**: I can run read-only SQL queries to help you analyze trends, find specific tenant records, or debug payment mismatches.
3.  **Logic Implementation**: I use **Server Actions** (`app/actions/`) to perform data mutations, ensuring that RLS (Row Level Security) and business logic are respected.
4.  **Security**: While I can read data for analysis, all mutations must go through the established Next.js Server Actions to ensure security and data integrity.

---

## 📂 Project Structure

```text
thost-v0/
├── app/                  # Next.js App Router (Routes & Layouts)
│   ├── admin/            # Owner Dashboard
│   ├── tenant/           # Resident Dashboard
│   ├── superadmin/       # Platform Management
│   ├── api/              # API Endpoints (Paytm callbacks, etc.)
│   └── actions/          # Backend Logic (Server Actions)
├── components/           # Reusable UI Components
├── lib/                  # Utilities (Supabase Client, Helpers)
├── hooks/                # Custom React Hooks
├── types/                # TypeScript Interfaces
└── public/               # Static Assets
```

---

## 🔄 Core Workflows

1.  **Tenant Joining**: Owner gives `joining_code` -> Tenant signs up and enters code -> Profile linked to PG.
2.  **Rent Generation**: System (or action) creates a `Payment` record monthly -> Status set to `Pending`.
3.  **Payment Flow**: Tenant initiates payment -> Redirected to Paytm -> Callback updates `Payment` status to `Paid`.
4.  **Complaint Loop**: Tenant raises ticket -> Owner receives notification -> Owner updates status to `Resolved`.

---
*Note: This document should be updated whenever significant changes are made to the schema or core logic.*
