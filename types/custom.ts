import { Database } from './supabase';

// coming from the supabase database type in the server.ts, it would be quite long to write this out when we need it in multiple places so we can just import it from here
export type Todo = Database['public']['Tables']['todos']['Row'];
