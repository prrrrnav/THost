
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function main() {
    console.log("Starting Dummy Data Cleanup...");

    // 1. Delete all existing payments
    const { error: deleteError } = await supabase
        .from('payments')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete everything

    if (deleteError) {
        console.error("Failed to delete existing payments:", deleteError);
        return;
    }
    console.log("Successfully deleted old dummy payments.");

    // 2. Fetch one tenant to assign the new payments to
    const { data: tenants, error: tenantError } = await supabase
        .from('tenants')
        .select('id, email, rent_amount, due_date')
        .limit(1);

    if (tenantError || !tenants || tenants.length === 0) {
        console.error("Could not find any tenants to attach the dummy data to.");
        return;
    }

    const tenant = tenants[0];
    console.log(`Creating dummy data for tenant: ${tenant.email}`);

    // 3. Create two new payment records for this month
    const currentDate = new Date();
    const currentMonthStr = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
    const dueDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), tenant.due_date || 5).toISOString().split('T')[0];
    const todayStr = currentDate.toISOString().split('T')[0];

    const pendingPayment = {
        tenant_id: tenant.id,
        tenant_email: tenant.email,
        month: currentMonthStr,
        month_year: currentMonthStr,
        amount: tenant.rent_amount || 10000,
        status: "Pending",
        due_date: dueDate,
        amount_paid: 0,
        payment_date: null
    };

    const paidPayment = {
        tenant_id: tenant.id,
        tenant_email: tenant.email,
        // Using "Previous Month" for realistic data or we can just name the month string differently (e.g., February 2026)
        month: "February " + currentDate.getFullYear(),
        month_year: "February " + currentDate.getFullYear(),
        amount: tenant.rent_amount || 10000,
        status: "Paid",
        due_date: new Date(currentDate.getFullYear(), 1, tenant.due_date || 5).toISOString().split('T')[0],
        amount_paid: tenant.rent_amount || 10000,
        payment_date: todayStr,
        paytm_order_id: "DUMMY_ORDER_" + Date.now(),
        paytm_txn_id: "DUMMY_TXN_" + Date.now(),
        payment_method: "UPI"
    };

    const { error: insertError } = await supabase
        .from('payments')
        .insert([pendingPayment, paidPayment]);

    if (insertError) {
        console.error("Failed to insert new dummy payments:", insertError);
    } else {
        console.log("Successfully inserted 1 Pending and 1 Paid payment record.");
    }
}

main();
