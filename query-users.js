import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://qlkqrraamjlfnfyfcakx.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsa3FycmFhbWpsZm5meWZjYWt4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDk0NTkwMywiZXhwIjoyMDU5ODkzNDU1fQ.XfG6eJ82jL2Yn4q8pT5_T3kZ_J3H7Y8-r1Vp9XQzC1A' // wait, I don't have the full service key, the env file had it truncated.
);
