const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const envPath = path.join(__dirname, '.env');
const envConfig = dotenv.parse(fs.readFileSync(envPath));

const supabase = createClient(envConfig.SUPABASE_URL, envConfig.SUPABASE_SERVICE_ROLE_KEY);

async function listTables() {
    try {
        const { data, error } = await supabase.from('pg_tables').select('tablename').eq('schemaname', 'public');
        if (error) {
            // Fallback to querying a known table if pg_tables fails (it usually requires more permissions)
            console.log('Error listing via pg_tables:', error.message);
        } else {
            console.log('Tables:', data.map(t => t.tablename));
        }

        // Try selecting from some common names
        const names = ['ngos', 'organizations', 'institutions'];
        for (const name of names) {
            const { error: err } = await supabase.from(name).select('*').limit(0);
            if (!err) console.log(`Table ${name} exists!`);
            else console.log(`Table ${name} DOES NOT exist: ${err.message}`);
        }
    } catch (e) {
        console.error(e);
    }
}

listTables();
