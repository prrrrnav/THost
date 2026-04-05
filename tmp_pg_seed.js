// tmp_pg_seed.js
const { createClient } = require("@supabase/supabase-js")
const fs = require("fs")
const path = require("path")

// Parse .env.local
const envLines = fs.readFileSync(path.join(__dirname, ".env.local"), "utf8").split("\n")
const env = {}
for (const line of envLines) {
  const t = line.trim()
  if (!t || t.startsWith("#")) continue
  const i = t.indexOf("=")
  if (i < 0) continue
  env[t.slice(0, i).trim()] = t.slice(i + 1).trim().replace(/^["']|["']$/g, "")
}

const URL = env.NEXT_PUBLIC_SUPABASE_URL
const KEY = env.SUPABASE_SERVICE_ROLE_KEY
if (!URL || !KEY) { process.stderr.write("Missing env vars\n"); process.exit(1) }

const sb = createClient(URL, KEY, { auth: { persistSession: false } })

const PG_ID = "78a984c0-28b6-48e6-bdfb-24c88270f235"
const EMAIL = "prrrranv@gmail.com"

const log = (msg) => process.stdout.write(msg + "\n")

async function step(label, p) {
  const { data, error } = await p
  if (error) log("FAIL [" + label + "] " + error.message + " | " + JSON.stringify(error.details))
  else log("OK   [" + label + "]")
  return { data, error }
}

async function main() {
  log("=== PG SEED START ===")

  // 1. Tenant
  await step("tenant upsert", sb.from("tenants").upsert({
    email: EMAIL, name: "Ashok Dayal", phone: "9876543210",
    room_number: "12", rent_amount: 8500, due_date: 5,
    status: "Pending", pg_id: PG_ID,
  }, { onConflict: "email" }))

  // 2. Payments
  await step("delete payments", sb.from("payments").delete().eq("tenant_email", EMAIL))

  const pmts = [
    { tenant_email: EMAIL, month: "April 2026",    amount: 8500, status: "Pending", payment_date: null,         created_at: "2026-04-01T00:00:00Z" },
    { tenant_email: EMAIL, month: "March 2026",    amount: 8500, status: "Paid",    payment_date: "2026-03-04", created_at: "2026-03-01T00:00:00Z" },
    { tenant_email: EMAIL, month: "February 2026", amount: 8500, status: "Paid",    payment_date: "2026-02-03", created_at: "2026-02-01T00:00:00Z" },
    { tenant_email: EMAIL, month: "January 2026",  amount: 8500, status: "Overdue", payment_date: null,         created_at: "2026-01-01T00:00:00Z" },
  ]
  await step("insert payments", sb.from("payments").insert(pmts))

  // 3. Notifications (no emoji in messages to avoid encoding issues in output)
  await step("delete old notifs", sb.from("notifications").delete().eq("target_tenant_email", "all"))

  const notifs = [
    { title: "April Rent Due - 5th April",         message: "Your April 2026 rent of Rs 8500 is due by 5th April. Please pay before due date to avoid Rs 200 late fee.", type: "reminder",     target_tenant_email: "all" },
    { title: "Water Supply Maintenance - 6 Apr",   message: "Water supply will be shut off on 6th April from 10 AM to 2 PM for plumbing work. Please store water beforehand.",        type: "maintenance", target_tenant_email: "all" },
    { title: "House Rules: Visitor Policy Updated",message: "Visitors not permitted after 10 PM. Laundry area timings updated to 7 AM - 9 PM. Thank you for cooperation.",             type: "rules",       target_tenant_email: "all" },
  ]
  await step("insert notifs", sb.from("notifications").insert(notifs))

  // 4. Verify
  const { data: t } = await sb.from("tenants").select("email,name,room_number,rent_amount,due_date,status,pg_id").eq("email", EMAIL).single()
  const { data: p } = await sb.from("payments").select("month,amount,status").eq("tenant_email", EMAIL).order("created_at", { ascending: false })
  const { data: n } = await sb.from("notifications").select("title").order("created_at", { ascending: false }).limit(5)

  log("\n=== VERIFICATION ===")
  log("Tenant: " + JSON.stringify(t))
  log("Payments count: " + (p ? p.length : "NULL"))
  if (p) p.forEach(r => log("  - " + r.month + " Rs " + r.amount + " [" + r.status + "]"))
  log("Notifications count: " + (n ? n.length : "NULL"))
  if (n) n.forEach(r => log("  - " + r.title))
  log("\n=== SEED DONE ===")
}

main().catch(e => { process.stderr.write("FATAL: " + e.message + "\n"); process.exit(1) })
