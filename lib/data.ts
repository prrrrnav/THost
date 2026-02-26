// Shared mock data for the PG Management System

export type TenantStatus = "Paid" | "Pending" | "Overdue"

export interface Tenant {
  id: string
  name: string
  room: string
  phone: string
  rent: number
  dueDate: string
  status: TenantStatus
}

export interface PaymentRecord {
  id: string
  month: string
  amount: number
  status: "Paid" | "Pending" | "Overdue"
  date: string
}

export interface PGOwner {
  id: string
  name: string
  city: string
  totalTenants: number
  monthlyRevenue: number
  plan: "Basic" | "Pro" | "Enterprise"
  status: "Active" | "Suspended"
}

export const tenants: Tenant[] = [
  { id: "1", name: "Rahul Sharma", room: "A-101", phone: "+91 98765 43210", rent: 9500, dueDate: "1st Mar 2026", status: "Paid" },
  { id: "2", name: "Priya Patel", room: "A-102", phone: "+91 87654 32109", rent: 10000, dueDate: "1st Mar 2026", status: "Pending" },
  { id: "3", name: "Amit Kumar", room: "B-201", phone: "+91 76543 21098", rent: 8500, dueDate: "1st Mar 2026", status: "Overdue" },
  { id: "4", name: "Sneha Reddy", room: "B-202", phone: "+91 65432 10987", rent: 12000, dueDate: "1st Mar 2026", status: "Paid" },
  { id: "5", name: "Vikram Singh", room: "C-301", phone: "+91 54321 09876", rent: 11500, dueDate: "1st Mar 2026", status: "Paid" },
  { id: "6", name: "Anjali Desai", room: "C-302", phone: "+91 43210 98765", rent: 9000, dueDate: "1st Mar 2026", status: "Pending" },
  { id: "7", name: "Karan Mehta", room: "A-103", phone: "+91 32109 87654", rent: 14500, dueDate: "1st Mar 2026", status: "Overdue" },
  { id: "8", name: "Neha Joshi", room: "B-203", phone: "+91 21098 76543", rent: 10500, dueDate: "1st Mar 2026", status: "Paid" },
  { id: "9", name: "Arjun Nair", room: "C-303", phone: "+91 10987 65432", rent: 13000, dueDate: "1st Mar 2026", status: "Paid" },
  { id: "10", name: "Deepika Iyer", room: "A-104", phone: "+91 99876 54321", rent: 15000, dueDate: "1st Mar 2026", status: "Pending" },
]

export const paymentHistory: PaymentRecord[] = [
  { id: "1", month: "February 2026", amount: 9500, status: "Paid", date: "1st Feb 2026" },
  { id: "2", month: "January 2026", amount: 9500, status: "Paid", date: "1st Jan 2026" },
  { id: "3", month: "December 2025", amount: 9500, status: "Paid", date: "1st Dec 2025" },
  { id: "4", month: "November 2025", amount: 9500, status: "Paid", date: "1st Nov 2025" },
  { id: "5", month: "October 2025", amount: 9500, status: "Paid", date: "3rd Oct 2025" },
  { id: "6", month: "September 2025", amount: 9000, status: "Paid", date: "1st Sep 2025" },
]

export const pgOwners: PGOwner[] = [
  { id: "1", name: "Rajesh Verma", city: "Bangalore", totalTenants: 42, monthlyRevenue: 420000, plan: "Enterprise", status: "Active" },
  { id: "2", name: "Sunita Agarwal", city: "Pune", totalTenants: 28, monthlyRevenue: 252000, plan: "Pro", status: "Active" },
  { id: "3", name: "Manoj Tiwari", city: "Hyderabad", totalTenants: 15, monthlyRevenue: 142500, plan: "Basic", status: "Active" },
  { id: "4", name: "Kavita Shah", city: "Mumbai", totalTenants: 56, monthlyRevenue: 672000, plan: "Enterprise", status: "Active" },
  { id: "5", name: "Prakash Rao", city: "Chennai", totalTenants: 20, monthlyRevenue: 190000, plan: "Pro", status: "Suspended" },
  { id: "6", name: "Anita Gupta", city: "Delhi", totalTenants: 35, monthlyRevenue: 385000, plan: "Pro", status: "Active" },
]

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount)
}
