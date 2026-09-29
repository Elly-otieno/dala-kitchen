import { createClient, SupabaseClient } from '@supabase/supabase-js';

const getEnvVar = (key: string, fallback: string): string => {
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
      return import.meta.env[key];
    }
  } catch {}
  try {
    if (typeof process !== 'undefined' && process.env && process.env[key]) {
      return process.env[key];
    }
  } catch {}
  return fallback;
};

const supabaseUrl = getEnvVar('VITE_SUPABASE_URL', 'https://qkubrfdvavqbbrmfdtuk.supabase.co');
const supabaseKey =
  getEnvVar('VITE_SUPABASE_PUBLISHABLE_KEY', '') ||
  getEnvVar('VITE_SUPABASE_ANON_KEY', '') ||
  'sb_publishable_83e-nhhXQb4E1IEFmL_r6w_SPekrp5Z';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseKey)
  : null;

