import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://arklbrtczdsanclqsfyw.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFya2xicnRjemRzYW5jbHFzZnl3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjQ5MDMwNTMsImV4cCI6MTk4MDQ3OTA1M30.bs7wiQxIWASAMlIkX2V0Ik2-rcSY05wlAFHo8T42iUE';

export const supabase = createClient(supabaseUrl, supabaseKey);
