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
}

export interface SupabaseTask {
  id: string;
  title: string;
  is_completed: boolean;
}

export interface SupabaseRoutine {
  id: string;
  title: string;
  tasks: SupabaseTask[];
}
