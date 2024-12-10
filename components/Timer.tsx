import { useEffect, useMemo, useState } from 'react';
import HomeCard from '@/components/HomeCard';
import { Task } from '@/app/types/types';
import { CardContent } from '@mui/material';

export default function Timer({ task }: Readonly<{ task: Task | undefined }>) {
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && task) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, task]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const placeholder = useMemo(() => {
    return <span>Select a routine to get started!</span>;
  }, []);

  return (
    <HomeCard title="Focus Timer">
      <div className="text-center">{task ? task.title : placeholder}</div>
      <div className="text-center">
        <div className="text-4xl font-mono mb-4">{formatTime(timer)}</div>
        {task && (
          <div className="text-sm text-gray-600">
            Currently tracking: {task.title}
          </div>
        )}
      </div>
    </HomeCard>
  );
}
