// src/types/index.ts

export interface Profile {
  id: string;
  role: "admin" | "tenant" | "superadmin";
  full_name?: string;
  email?: string;
}

export interface PgDetail {
  id: string;
  name: string;
  address?: string;
  owner_id: string;
  joining_code?: string;
}

export interface Tenant {
  id: string;
  name: string;
  email: string;
  phone?: string;
  room_number: string;
  rent_amount: number;
  due_date: number;
  status: "Active" | "Inactive";
  pg_id?: string;
  created_at: string;
}

export interface Payment {
  id: string;
  tenant_email: string;
  month: string;
  amount: number;
  status: "Paid" | "Pending" | "Overdue";
  payment_date?: string;
  created_at: string;
  paytm_order_id?: string;
  penalty_amount?: number;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  pg_id?: string;
  created_at: string;
}

export interface ElectricityBill {
  id: string;
  unit_shop: string;
  units_consumed: number;
  amount: number;
  month: string;
  pg_id?: string;
}

export interface Complaint {
  id: string;
  tenant_email: string;
  title: string;
  description?: string;
  status: "Pending" | "In Progress" | "Resolved";
  created_at: string;
}

export interface FinanceStats {
  revenue: number;
  expenses: number;
  profit: number;
  totalOutstanding: number;
}

export interface Room {
  id: string;
  room_number: string;
  capacity: number;
  current_occupancy: number;
  base_rent: number;
  pg_id?: string;
}
