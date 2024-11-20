import { useState } from 'react';
import { Routine } from '@/app/types/types';

export default function useRoutineEditor() {
  const [shouldShow, setShouldShow] = useState<boolean>(false);
  const [routine, setRoutine] = useState<Routine | undefined>();

  // TODO: return a context

  return { shouldShow, setShouldShow, routine, setRoutine };
}
