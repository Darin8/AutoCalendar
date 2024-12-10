'use client';

import Timer from '@/components/Timer';
import { Task } from '@/app/types/types';
import { useEffect, useState } from 'react';
import { useSession, useSessionContext } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/navigation';
import TaskList from '@/components/tasks/TaskList';

export default function Home() {
  const [currentTask, setCurrentTask] = useState<Task>();
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
        <Timer task={currentTask} />
        <TaskList setCurrentTask={setCurrentTask} />
      </div>
    </main>
  ) : null;
}
