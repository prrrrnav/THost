const { createClient } = require('@supabase/supabase-js');

// Initialize with Service Role Key to bypass RLS
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function main() {
    console.log("Starting Migration...");

    // 1. Get MRK PREMIUM STAYS property ID
    const { data: pgData, error: pgError } = await supabase
        .from('pg_details')
        .select('id')
        .eq('name', 'MRK PREMIUM STAYS')
        .single();

    if (pgError || !pgData) {
        console.error("Could not find MRK PREMIUM STAYS:", pgError);
        return;
    }

    const pgId = pgData.id;
    console.log("Found MRK PREMIUM STAYS ID:", pgId);

    // 2. Update MRK PREMIUM STAYS capacity to 60
    const { error: updateCapacityError } = await supabase
        .from('pg_details')
        .update({ total_beds: 60 })
        .eq('id', pgId);

    if (updateCapacityError) {
        console.error("Failed to update PG capacity:", updateCapacityError);
    } else {
        console.log("Successfully set MRK PREMIUM STAYS capacity to 60.");
    }

    // 3. Link all tenants to this PG
    const { data: tenantsBeforeUpdate, error: fetchTenantsError } = await supabase
        .from('tenants')
        .select('id');

    if (fetchTenantsError || !tenantsBeforeUpdate) {
        console.error("Failed to fetch tenants for update.");
        return;
    }

    if (tenantsBeforeUpdate.length === 0) {
        console.log("No tenants found to migrate.");
        return;
    }

    const { error: updateTenantsError } = await supabase
        .from('tenants')
        .update({ pg_id: pgId })
        // Ensure we update all records
        .not('id', 'is', null);

    if (updateTenantsError) {
        console.error("Failed to migrate tenants:", updateTenantsError);
    } else {
        console.log(`Successfully migrated ${tenantsBeforeUpdate.length} tenants strictly to MRK PREMIUM STAYS.`);
    }
}

main();
