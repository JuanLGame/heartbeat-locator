
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ifkmqvdmipaamodomwjl.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlma21xdmRtaXBhYW1vZG9td2psIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE3NDkxMTIsImV4cCI6MjA1NzMyNTExMn0.CZmCClFNLwSqV3n0eOakWhb_pbd5SK2bIpsl5JkU1Yw";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
