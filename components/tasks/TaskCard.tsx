import { Dispatch, SetStateAction, useCallback, useState } from 'react';
import { Task } from '@/app/types/types';
import { Button, Card, CardContent, Checkbox } from '@mui/material';

export default function TaskCard({
  setCurrentTask,
  task,
}: Readonly<{
  setCurrentTask: Dispatch<SetStateAction<Task | undefined>>;
  task: Task;
}>) {
  const [isCompleted, setIsCompleted] = useState<boolean>(task.isCompleted);

  const onClick = useCallback(() => {
    setCurrentTask(task);
  }, [setCurrentTask, task]);
  return (
    <Card key={task.id}>
      <CardContent className="space-x-4">
        <Checkbox
          checked={isCompleted}
          onChange={() => setIsCompleted(!isCompleted)}
        />
        {task.title}
        <Button onClick={onClick}>Start</Button>
      </CardContent>
    </Card>
  );
}
