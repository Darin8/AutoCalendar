import { useMemo } from 'react';
import HomeCard from '@/components/HomeCard';
import { Routine } from '@/app/types/types';
import TaskTimer from './TaskTimer';

export default function Timer({
  routine,
}: Readonly<{ routine: Routine | undefined }>) {
  const placeholder = useMemo(() => {
    return <span>Select a routine to get started!</span>;
  }, []);

  return (
    // <HomeCard title="Focus Timer">
    <div className="text-center">
      {routine ? <TaskTimer routine={routine} /> : placeholder}
    </div>
    // </HomeCard>
  );
}
