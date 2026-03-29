const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: 'admin/server/.env' });

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function checkSchema() {
    try {
        const { data, error } = await supabase.rpc('get_table_columns', { table_name: 'receivers' });
        // If RPC isn't available, we can try querying information_schema if we have access via SQL
        // But since we are using supabaseAdmin, maybe we can try this:
        const { data: cols, error: err } = await supabase.from('receivers').select('*').limit(0);

        console.log('Receiver columns:', Object.keys(await supabase.from('receivers').select('*').limit(1).then(r => r.data?.[0] || {})));

        // Let's try to query the schema directly via SQL if possible? No, but we can try common names.
        // Actually, if researchers can't find it, I'll just look at the code.

        const { data: allData } = await supabase.from('receivers').select('*').limit(5);
        if (allData && allData.length > 0) {
            console.log('Receiver sample:', allData[0]);
        } else {
            console.log('No data in receivers table');
        }
    } catch (e) {
        console.error(e);
    }
}

checkSchema();
