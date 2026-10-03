import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ccogfgpkostjofuushek.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_3JK1K6rsjWGDY5hQPQJx8g_f0DfyvUN';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
