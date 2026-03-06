
const { createClient } = require('@supabase/supabase-js');

// Initialize with Service Role Key to bypass RLS
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function main() {
    console.log("Adding MRK PREMIUM STAYS for owner@gmail.com...");

    // owner_id for owner@gmail.com
    const ownerId = "428a1235-e9ca-46a3-a7d0-66b237cf49ee";

    const { data, error } = await supabase
        .from('pg_details')
        .insert([
            {
                owner_id: ownerId,
                name: 'MRK PREMIUM STAYS',
                address: 'Default Address',
                joining_code: 'MRK123'
            }
        ])
        .select();

    if (error) {
        console.error("Failed to insert:", error.message);
    } else {
        console.log("Successfully inserted!");
        console.log(data);
    }
}

main();
