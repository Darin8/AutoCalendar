import { useMemo, useState } from 'react';
import { Task } from '@/app/types/types';
import { Card, CardContent, Checkbox } from '@mui/material';

export default function TaskCard({ task }: Readonly<{ task: Task }>) {
  const [isCompleted, setIsCompleted] = useState<boolean>(task.isCompleted);

  const duration = useMemo(() => {
    const durationInSeconds = task.durationInSeconds;
    const date = new Date(durationInSeconds * 1000);
    const hours = Math.floor(durationInSeconds / 3600);
    const minutes = date.getUTCMinutes();
    const seconds = date.getUTCSeconds();

    const pad = (num: number) => String(num).padStart(2, '0'); // Add leading zeros

    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }, [task.durationInSeconds]);

  return (
    <Card key={task.id}>
      <CardContent className="space-x-4">
        <Checkbox
          checked={isCompleted}
          onChange={() => setIsCompleted(!isCompleted)}
        />
        {task.title}
        <span>{duration}</span>
      </CardContent>
    </Card>
  );
}
