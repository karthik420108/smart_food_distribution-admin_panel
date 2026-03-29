const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load .env
const envPath = path.join(__dirname, '.env');
const envConfig = dotenv.parse(fs.readFileSync(envPath));

const supabase = createClient(envConfig.SUPABASE_URL, envConfig.SUPABASE_SERVICE_ROLE_KEY);

async function testQuery() {
    console.log('Testing receivers fields...');
    const fields = ['fssai_number', 'gst_number', 'kyc_document_url', 'selfie_url', 'receiver_type'];
    for (const field of fields) {
        const { error } = await supabase.from('receivers').select(field).limit(1);
        if (error) {
            console.log(`Field ${field}: ERROR - ${error.message}`);
        } else {
            console.log(`Field ${field}: OK`);
        }
    }
}

testQuery();
