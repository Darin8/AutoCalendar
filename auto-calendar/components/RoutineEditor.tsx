import { useCallback, useContext, useEffect, useState } from 'react';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import HomeCard from '@/components/HomeCard';
import { Button, Dialog, Typography } from '@mui/material';
import { RoutineEditorContext } from '@/components/RoutineList';
import { Task } from '@/app/types/types';
import { v4 as uuidv4 } from 'uuid';

export default function RoutineEditor() {
  const [title, setTitle] = useState('');
  const [tasks, setTasks] = useState<Task[]>([
    { id: uuidv4(), title: '', isCompleted: false, durationInSeconds: 0 }, // Generate unique ID
  ]); // Default to empty array
  const [loading, setLoading] = useState(false);
  const supabase = useSupabaseClient();
  const user = useSession()?.user;

  const { shouldShow, setShouldShow, routine, setRoutine } =
    useContext(RoutineEditorContext);

  useEffect(() => {
    if (routine) {
      setTitle(routine.title);
      setTasks(routine.tasks);
    }
  }, [routine]);

  const addRoutine = async () => {
    setLoading(true);

    try {
      // Insert Routine
      const { data: routine, error: routineError } = await supabase
        .from('routines')
        .insert([{ title, user_id: user?.id }])
        .select()
        .single();

      if (routineError) throw routineError;

      if (tasks.length === 0) throw new Error('Tasks cannot be empty');

      // Insert Tasks
      const tasksToInsert = tasks.map((task) => ({
        routine_id: routine.id,
        title: task.title,
        is_completed: false,
        duration_seconds: task.durationInSeconds,
      }));

      const { error: taskError } = await supabase
        .from('tasks')
        .insert(tasksToInsert);
      if (taskError) throw taskError;

      alert('Routine added successfully!');
      setTitle('');
      setTasks([]);
    } catch (error) {
      console.error('Error adding routine:', error);
    } finally {
      setLoading(false);
      setShouldShow(false);
    }
  };

  const editRoutine = async () => {
    if (!routine) throw new Error('Routine not found');
    setLoading(true);

    const { tasks: existingTasks } = routine;

    try {
      // Update Routine
      const { error: routineError } = await supabase
        .from('routines')
        .update({ title })
        .eq('id', routine.id);

      if (routineError) throw routineError;

      const { toAdd, toUpdate, toDelete } = diffTasks(existingTasks, tasks);

      // Insert New Tasks
      if (toAdd.length > 0) {
        const tasksToInsert = toAdd.map((task) => ({
          routine_id: routine.id,
          title: task.title,
          is_completed: false,
          duration_seconds: task.durationInSeconds,
        }));

        const { error: addError } = await supabase
          .from('tasks')
          .insert(tasksToInsert);
        if (addError) throw addError;
      }

      // Update Existing Tasks
      for (const task of toUpdate) {
        const { error: updateError } = await supabase
          .from('tasks')
          .update({
            title: task.title,
            duration_seconds: task.durationInSeconds,
          })
          .eq('id', task.id);

        if (updateError) throw updateError;
      }

      // Delete Removed Tasks
      if (toDelete.length > 0) {
        const taskIdsToDelete = toDelete.map((task) => task.id);

        const { error: deleteError } = await supabase
          .from('tasks')
          .delete()
          .in('id', taskIdsToDelete);

        if (deleteError) throw deleteError;
      }

      alert('Routine updated successfully!');
    } catch (error) {
      console.error('Error editing routine:', error);
      alert('Failed to update the routine.');
    } finally {
      setLoading(false);
    }
  };

  const diffTasks = (existingTasks: Task[], updatedTasks: Task[]) => {
    const toAdd = updatedTasks.filter(
      (updatedTask) =>
        !existingTasks.some(
          (existingTask) => existingTask.id === updatedTask.id
        )
    );

    const toUpdate = updatedTasks.filter((updatedTask) =>
      existingTasks.some(
        (existingTask) =>
          existingTask.id === updatedTask.id &&
          (existingTask.title !== updatedTask.title ||
            existingTask.durationInSeconds !== updatedTask.durationInSeconds)
      )
    );

    const toDelete = existingTasks.filter(
      (existingTask) =>
        !updatedTasks.some((updatedTask) => updatedTask.id === existingTask.id)
    );

    return { toAdd, toUpdate, toDelete };
  };

  const addTask = () => {
    setTasks((prev) => {
      return [
        ...prev,
        { id: uuidv4(), title: '', isCompleted: false, durationInSeconds: 0 }, // Generate unique ID
      ];
    });
  };

  const onClickShow = useCallback(() => {
    setTitle('');
    setTasks([
      { id: uuidv4(), title: '', isCompleted: false, durationInSeconds: 0 }, // Generate unique ID
    ]);
    setRoutine(undefined);
    setShouldShow(true);
  }, [setRoutine, setShouldShow]);

  return (
    <>
      <Button variant="contained" onClick={onClickShow} className="p-2">
        <Typography variant="button">Add Routine</Typography>
      </Button>
      <Dialog open={shouldShow}>
        <HomeCard title="Add Routine">
          <input
            className="border p-2 w-full mb-4"
            type="text"
            placeholder="Routine Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <div>
            {tasks.map((task, index) => (
              <div key={task.id} className="mb-4">
                <input
                  className="border p-2 mr-2"
                  type="text"
                  placeholder="Task Title"
                  value={task.title}
                  onChange={(e) =>
                    setTasks((prev) =>
                      prev.map((t, i) =>
                        i === index ? { ...t, title: e.target.value } : t
                      )
                    )
                  }
                />
                <input
                  className="border p-2"
                  type="number"
                  placeholder="Duration (seconds)"
                  value={task.durationInSeconds}
                  onChange={(e) =>
                    setTasks((prev) =>
                      prev.map((t, i) =>
                        i === index
                          ? {
                              ...t,
                              durationInSeconds: parseInt(e.target.value, 10),
                            }
                          : t
                      )
                    )
                  }
                />
              </div>
            ))}
            <button
              className="bg-gray-200 text-sm p-2 rounded"
              onClick={addTask}
            >
              + Add Task
            </button>
          </div>
          <div className="space-x-4">
            <button
              className="bg-blue-500 text-white p-2 rounded mt-4"
              onClick={() => (routine ? editRoutine() : addRoutine())}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Routine'}
            </button>
            <button
              className="bg-gray-200 p-2 rounded mt-4"
              onClick={() => setShouldShow(false)}
            >
              Cancel
            </button>
          </div>
        </HomeCard>
      </Dialog>
    </>
  );
}
