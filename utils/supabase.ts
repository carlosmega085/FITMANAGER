// eslint-disable-next-line import/no-unresolved
import 'react-native-url-polyfill/auto';

import { createClient } from '@supabase/supabase-js';

// Tus variables de configuración
const SUPABASE_URL = 'https://ijiivoqyumqzhhiosqdr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlqaWl2b3F5dW1xemhoaW9zcWRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxMDQyMDcsImV4cCI6MjA3OTY4MDIwN30.tp3uWlpBuaZUMO5eJAcBGIU7fjGdrxNWM0ucxfdtGww';

console.log('la URL ', SUPABASE_URL);
console.log('la clave anon ', SUPABASE_ANON_KEY);

// Configuración adicional recomendada para React Native/Expo
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    // Si usas Auth, asegúrate de configurar el storage de persistencia adecuado,
    // o déjalo 'undefined' si no usas Auth o manejas la sesión manualmente.
    storage: undefined, 
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export default supabase;
