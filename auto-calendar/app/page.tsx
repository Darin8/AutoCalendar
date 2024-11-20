'use client';

import Timer from '@/components/Timer';
import RoutineList from '@/components/RoutineList';
import { Routine } from '@/app/types/types';
import { useEffect, useState } from 'react';
import { useSession, useSessionContext } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [currentRoutine, setCurrentRoutine] = useState<Routine>();
  const session = useSession();
  const sessionContext = useSessionContext();
  const router = useRouter();

  useEffect(() => {
    if (!sessionContext.isLoading && !session) {
      router.push('/auth');
    }
  }, [session, router, sessionContext.isLoading]);

  return session ? (
    <main>
      <div className="grid md:grid-cols-2 gap-6">
        <Timer routine={currentRoutine} />
        <RoutineList setCurrentRoutine={setCurrentRoutine} />
      </div>
    </main>
  ) : null;
}
