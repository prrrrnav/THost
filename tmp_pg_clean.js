const { Client } = require('pg');

const connectionString = "postgresql://postgres.ismcqfyoyzxgyiugjfqx:TheH0st0908%23@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres";

async function main() {
    const client = new Client({
        connectionString,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        console.log("Connected to Postgres directly...");

        // 1. Delete all payments
        await client.query('DELETE FROM public.payments');
        console.log("Deleted all existing payments successfully.");

        // 2. Fetch a single tenant
        // 2. Fetch a single tenant that has a valid email address
        const res = await client.query("SELECT id, email, rent_amount, due_date FROM public.tenants WHERE email IS NOT NULL AND email != '' LIMIT 1");

        if (res.rows.length === 0) {
            console.log("No tenants found to attach the dummy data to.");
            return;
        }

        const tenant = res.rows[0];
        console.log(`Creating dummy data for tenant: ${tenant.email}`);

        // 3. Insert specific dummy data
        const currentDate = new Date();
        const currentMonthStr = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
        const dueDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), tenant.due_date || 5).toISOString().split('T')[0];
        const todayStr = currentDate.toISOString().split('T')[0];

        // Previous month paid
        const prevMonthDate = new Date();
        prevMonthDate.setMonth(prevMonthDate.getMonth() - 1);
        const prevMonthStr = prevMonthDate.toLocaleString('default', { month: 'long', year: 'numeric' });

        const queryText = `
            INSERT INTO public.payments 
            (tenant_id, tenant_email, month, month_year, amount, status, due_date, amount_paid, payment_date, paytm_order_id, paytm_txn_id, payment_method) 
            VALUES 
            ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12),
            ($13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24)
        `;

        const values = [
            // Row 1: Pending (Current Month)
            tenant.id, tenant.email, currentMonthStr, currentMonthStr, tenant.rent_amount || 10000, 'Pending', dueDate, 0, null, null, null, null,
            // Row 2: Paid (Previous Month, so it's distinguishable, user said "one is marked paid and one pending and rent for this month")
            // Actually user said "one marked paid and one pending and rent for this month". Maybe both for this month?
            tenant.id, tenant.email, currentMonthStr + " Paid", currentMonthStr + " Paid", tenant.rent_amount || 10000, 'Paid', dueDate, tenant.rent_amount || 10000, todayStr, "ORDER_DUMMY", "TXN_DUMMY", "UPI"
        ];

        await client.query(queryText, values);
        console.log("Inserted precisely 1 Pending and 1 Paid payment for testing.");

    } catch (err) {
        console.error("Database operation failed:", err);
    } finally {
        await client.end();
    }
}

main();
