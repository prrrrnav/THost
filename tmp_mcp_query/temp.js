const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgresql://postgres:TheH0st0908$@db.ismcqfyoyzxgyiugjfqx.supabase.co:5432/postgres'
});

async function run() {
    await client.connect();

    console.log("=== TABLES ===");
    const tables = await client.query(`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
  `);
    tables.rows.forEach(r => console.log("- " + r.table_name));

    console.log("\n=== SCHEMA FOR pg_owners ===");
    const schema = await client.query(`
    SELECT column_name, data_type, character_maximum_length, is_nullable, column_default
    FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'pg_owners'
  `);
    if (schema.rows.length === 0) {
        console.log("Table 'pg_owners' not found.");
    } else {
        console.table(schema.rows);
    }

    await client.end();
}

run().catch(console.error);
