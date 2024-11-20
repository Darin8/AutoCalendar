import { Routine, Task } from '@/app/types/types';
import { useState, useEffect, useMemo } from 'react';
import { Button } from '@mui/material';

export default function TaskTimer({ routine }: Readonly<{ routine: Routine }>) {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [currentTaskIndex, setCurrentTaskIndex] = useState<number>(0);
  const [currentTask, setCurrentTask] = useState<Task>(routine?.tasks?.[0]);

  // TODO: Optimize
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setTimeLeft((timeLeft) => timeLeft - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  useEffect(() => {
    // Reset the current task and task index when the routine changes
    setCurrentTaskIndex(0);
    setCurrentTask(routine.tasks?.[0]);
  }, [routine]);

  useEffect(() => {
    // Reset the timer and update the current task when the task index changes
    if (routine.tasks) {
      const newCurrentTask = routine.tasks[currentTaskIndex];
      setCurrentTask(newCurrentTask);
      setTimeLeft(newCurrentTask.durationInSeconds); // Reset timer
      setIsRunning(false); // Stop timer
    }
  }, [currentTaskIndex, routine]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(currentTask.durationInSeconds);
  };

  const nextTask = () => {
    if (routine?.tasks && currentTaskIndex < routine.tasks.length) {
      setCurrentTaskIndex(currentTaskIndex + 1);
    }
  };

  const previousTask = () => {
    if (routine?.tasks && currentTaskIndex > 0) {
      setCurrentTaskIndex(currentTaskIndex - 1);
    }
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  // Progress Calculation
  const progress = useMemo(
    () => (timeLeft / currentTask?.durationInSeconds) * 100,
    [currentTask?.durationInSeconds, timeLeft]
  );

  return (
    <div>
      <span className="text-xl">
        {currentTask ? currentTask.title : 'No task selected'}
      </span>

      {/* Circular Progress Bar */}
      <div className="flex justify-center items-center my-6">
        <svg
          className="w-40 h-40"
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background Circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="10"
          />
          {/* Progress Circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="10"
            strokeDasharray="282.6" // Circumference = 2 * π * radius (2 * π * 45)
            strokeDashoffset={282.6 - (282.6 * progress) / 100}
            strokeLinecap="round"
            transform="rotate(-90 50 50)" // Rotate the circle to start from top
          />
        </svg>
        {/* Timer in the Center */}
        <div className="absolute text-3xl font-mono">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>
      </div>

      {/* Timer Controls */}
      <div className="space-x-4">
        <Button
          variant="contained"
          className={'px-6 py-2 rounded '}
          onClick={toggleTimer}
        >
          {isRunning ? 'Pause' : 'Start'}
        </Button>
        <Button
          variant="outlined"
          className="px-6 py-2 rounded"
          onClick={resetTimer}
        >
          Reset
        </Button>
      </div>
      <div className="space-x-4 mt-4">
        <Button
          variant="contained"
          onClick={previousTask}
          disabled={currentTaskIndex === 0}
          className="p-2"
        >
          Previous Task
        </Button>
        <Button
          variant="contained"
          onClick={nextTask}
          disabled={
            !routine?.tasks || currentTaskIndex === routine.tasks.length - 1
          }
          className="p-2"
        >
          Next Task
        </Button>
      </div>
    </div>
  );
}
