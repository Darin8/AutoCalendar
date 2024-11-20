'use client';

import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { createClient } from '@/lib/supabase/client';
import { ReactNode } from 'react';

export default function SessionProvider({ children }: { children: ReactNode }) {
  const supabase = createClient();

  return (
    <SessionContextProvider supabaseClient={supabase}>
      {children}
    </SessionContextProvider>
  );
}
