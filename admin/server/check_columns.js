const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: 'admin/server/.env' });

const supabaseUrl = process.env.SUPABASE_URL || 'https://your-project.supabase.co';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function checkSchema() {
    try {
        const { data: donorFields } = await supabase.from('donors').select('*').limit(1);
        const { data: receiverFields } = await supabase.from('receivers').select('*').limit(1);

        console.log('Donor fields:', donorFields && donorFields.length > 0 ? Object.keys(donorFields[0]) : 'no data');
        console.log('Receiver fields:', receiverFields && receiverFields.length > 0 ? Object.keys(receiverFields[0]) : 'no data');
    } catch (e) {
        console.error(e);
    }
}

checkSchema();
