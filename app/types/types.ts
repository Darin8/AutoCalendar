export interface Habit {
  id: string;
  title: string;
  streak: number;
  completionDates: string[];
  isCompleted: boolean;
}
export interface Routine {
  id: string;
  title: string;
  tasks: Task[];
}
export interface Task {
  id: string;
  title: string;
  isCompleted: boolean;
  durationInSeconds: number;
}

export interface SupabaseTask {
  id: string;
  title: string;
  is_completed: boolean;
  duration_seconds: number;
}

export interface SupabaseRoutine {
  id: string;
  title: string;
  tasks: SupabaseTask[];
}
