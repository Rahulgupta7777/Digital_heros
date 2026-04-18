import { createClient } from '@supabase/supabase-js';
const supabase = createClient('https://qlkqrraamjlfnfyfcakx.supabase.co', 'sb_publishable_OX6VBfKF5zOqUr7a2w9uwg_ow_gAS0B');
supabase.auth.getUser().then(console.log).catch(console.error);
