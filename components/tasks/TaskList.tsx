import {
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { SupabaseTask, Task } from '@/app/types/types';
import TaskCard from '@/components/tasks/TaskCard';
import HomeCard from '../HomeCard';
import TaskEditor from './TaskEditor';

interface TaskEditorContextType {
  shouldShow: boolean;
  setShouldShow: Dispatch<SetStateAction<boolean>>;
  task: Task | undefined;
  setTask: Dispatch<SetStateAction<Task | undefined>>;
}

export const TaskEditorContext = createContext<TaskEditorContextType>({
  shouldShow: false,
  setShouldShow: () => {},
  task: undefined,
  setTask: () => {},
});

export default function TaskList({
  setCurrentTask,
}: Readonly<{
  setCurrentTask: Dispatch<SetStateAction<Task | undefined>>;
}>) {
  const [shouldShow, setShouldShow] = useState<boolean>(false);
  const [task, setTask] = useState<Task | undefined>();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [refetchTrigger, setRefetchTrigger] = useState<number>(0);
  const [error, setError] = useState<string>();
  const session = useSession();
  const supabase = useSupabaseClient();

  useEffect(() => {
    const fetchTasks = async () => {
      if (!session?.user) return;
      const { data, error } = await supabase
        .from('tasks')
        .select(
          `
        id,
        title,
        is_completed
      `
        )
        .eq('user_id', session.user.id);

      if (error) {
        console.error('Error fetching tasks:', error);
        setError(error.message);
        return;
      }

      // map from supabase schema
      const tasks = (data as SupabaseTask[]).map((task) => ({
        id: task.id,
        title: task.title,
        isCompleted: task.is_completed,
      }));

      setTasks(tasks);
    };

    fetchTasks();
  }, [session?.user, supabase, refetchTrigger]);

  const list = useMemo(() => {
    return tasks.map((task: Task) => (
      <TaskCard key={task.id} setCurrentTask={setCurrentTask} task={task} />
    ));
  }, [setCurrentTask, tasks]);

  const title = useMemo(() => {
    return (
      <div className="flex justify-between">
        Tasks
        <TaskEditor refetch={() => setRefetchTrigger((prev) => prev + 1)} />
      </div>
    );
  }, []);

  return (
    <TaskEditorContext.Provider
      value={{ shouldShow, setShouldShow, task, setTask }}
    >
      <HomeCard title={title}>
        <div className="space-y-4">{tasks.length > 0 ? list : error}</div>
      </HomeCard>
    </TaskEditorContext.Provider>
  );
}
