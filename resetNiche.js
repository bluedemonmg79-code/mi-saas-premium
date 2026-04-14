import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const envFile = fs.readFileSync('.env.local', 'utf8');
const VITE_SUPABASE_URL = envFile.match(/VITE_SUPABASE_URL=(.*)/)[1].trim();
const VITE_SUPABASE_ANON_KEY = envFile.match(/VITE_SUPABASE_ANON_KEY=(.*)/)[1].trim();

const supabase = createClient(VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY);

async function run() {
  console.log('Fetching profiles...');
  const { data: profiles, error: getErr } = await supabase.from('profiles').select('id, username, business_name, niche');
  if (getErr) {
    console.error('Error fetching:', getErr);
    return;
  }
  
  console.log('Current profiles:', profiles);

  console.log('Resetting niche to NULL for all profiles...');
  for (const p of profiles) {
    const { error: updErr } = await supabase.from('profiles').update({ niche: null }).eq('id', p.id);
    if (updErr) {
      console.error('Error updating profile', p.id, updErr);
    }
  }

  console.log('Done! Re-fetching to verify:');
  const { data: profilesAfter } = await supabase.from('profiles').select('id, username, business_name, niche');
  console.log('Profiles after reset:', profilesAfter);
}

run();
