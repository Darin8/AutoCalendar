import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import type { Routine, SupabaseRoutine } from '@/app/types/types';
import HomeCard from '@/components/HomeCard';
import RoutineCard from '@/components/RoutineCard';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import RoutineEditor from '@/components/RoutineEditor';
import { createContext } from 'react';

interface RoutineEditorContextType {
  shouldShow: boolean;
  setShouldShow: Dispatch<SetStateAction<boolean>>;
  routine: Routine | undefined;
  setRoutine: Dispatch<SetStateAction<Routine | undefined>>;
}

export const RoutineEditorContext = createContext<RoutineEditorContextType>({
  shouldShow: false,
  setShouldShow: () => {},
  routine: undefined,
  setRoutine: () => {},
});

export default function RoutineList({
  setCurrentRoutine,
}: Readonly<{
  setCurrentRoutine: Dispatch<SetStateAction<Routine | undefined>>;
}>) {
  const [shouldShow, setShouldShow] = useState<boolean>(false);
  const [routine, setRoutine] = useState<Routine | undefined>();
  const [routines, setRoutines] = useState<Routine[]>([]);
  const session = useSession();
  const supabase = useSupabaseClient();

  useEffect(() => {
    const fetchRoutines = async () => {
      if (!session?.user) return;
      const { data, error } = await supabase
        .from('routines')
        .select(
          `
        id,
        title,
        tasks (
          id,
          title,
          is_completed,
          duration_seconds
        )
      `
        )
        .eq('user_id', session.user.id);

      if (error) {
        console.error('Error fetching routines:', error);
        alert('Failed to fetch routines.');
        return;
      }

      // Map the Supabase data into your application types
      const routines = (data as SupabaseRoutine[]).map((routine) => ({
        id: routine.id,
        title: routine.title,
        tasks: routine.tasks.map((task) => ({
          id: task.id,
          title: task.title,
          isCompleted: task.is_completed, // Transform field name
          durationInSeconds: task.duration_seconds, // Transform field name
        })),
      }));

      setRoutines(routines);
    };

    fetchRoutines();
  }, [session?.user, supabase]);

  const list = useMemo(() => {
    return routines.map((routine: Routine) => (
      <RoutineCard
        key={routine.id}
        routine={routine}
        setCurrentRoutine={setCurrentRoutine}
      />
    ));
  }, [routines, setCurrentRoutine]);

  const title = useMemo(() => {
    return (
      <div className="flex justify-between">
        Routines
        <RoutineEditor />
      </div>
    );
  }, []);

  return (
    <RoutineEditorContext.Provider
      value={{ shouldShow, setShouldShow, routine, setRoutine }}
    >
      <HomeCard title={title}>
        <div className="space-y-4">{list}</div>
      </HomeCard>
    </RoutineEditorContext.Provider>
  );
}
