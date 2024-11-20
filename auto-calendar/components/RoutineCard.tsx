import { Routine, Task } from '@/app/types/types';
import {
  Dispatch,
  SetStateAction,
  useContext,
  useMemo,
  useState,
  useCallback,
} from 'react';
import TaskCard from '@/components/TaskCard';
import { Button, Typography } from '@mui/material';
import HomeCard from '@/components/HomeCard';
import { RoutineEditorContext } from '@/components/RoutineList';

export default function RoutineCard({
  routine,
  setCurrentRoutine,
}: Readonly<{
  routine: Routine;
  setCurrentRoutine: Dispatch<SetStateAction<Routine | undefined>>;
}>) {
  const [tasks] = useState<Task[]>(routine.tasks);

  const taskList = useMemo(() => {
    return tasks.map((task) => <TaskCard key={task.id} task={task} />);
  }, [tasks]);

  const { setShouldShow, setRoutine } = useContext(RoutineEditorContext);

  const onClickEdit = useCallback(() => {
    setShouldShow(true);
    setRoutine(routine);
  }, [routine, setRoutine, setShouldShow]);

  const titleComponent = useMemo(() => {
    return (
      <div className="flex flex-row justify-between space-x-10 px-4">
        {routine.title}
        <div className="space-x-2">
          <Button
            className="p-2"
            variant="contained"
            onClick={() => {
              setCurrentRoutine(routine);
            }}
          >
            <Typography variant="button">Select</Typography>
          </Button>
          <Button
            className="p-2"
            variant="contained"
            onClick={() => {
              onClickEdit();
            }}
          >
            <Typography variant="button">Edit</Typography>
          </Button>
        </div>
      </div>
    );
  }, [onClickEdit, routine, setCurrentRoutine]);

  return (
    <HomeCard title={titleComponent}>
      <div className="container mx-auto p-4 space-y-4">{taskList}</div>
    </HomeCard>
  );
}
