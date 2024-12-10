import { Button, Dialog, Input, Typography } from '@mui/material';
import { useCallback, useContext, useEffect, useState } from 'react';
import { TaskEditorContext } from './TaskList';
import { useSupabaseClient } from '@supabase/auth-helpers-react';

export default function TaskEditor({
  refetch,
}: Readonly<{ refetch: () => void }>) {
  const [title, setTitle] = useState('');
  const { shouldShow, setShouldShow, task } = useContext(TaskEditorContext);
  const [loading, setLoading] = useState(false);
  const supabase = useSupabaseClient();

  useEffect(() => {
    if (task) {
      setTitle(task.title);
    }
  }, [task]);

  const onClickShow = useCallback(() => {
    setTitle('');
    setShouldShow(true);
  }, [setShouldShow]);

  const addTask = useCallback(async () => {
    setLoading(true);

    try {
      const taskToInsert = {
        title,
        is_completed: false,
      };

      const { error: taskError } = await supabase
        .from('tasks')
        .insert(taskToInsert);

      if (taskError) throw taskError;

      setTitle('');
      refetch();
    } catch (error) {
      console.error('Error adding task:', error);
    } finally {
      setLoading(false);
      setShouldShow(false);
    }
  }, [refetch, setShouldShow, supabase, title]);

  return (
    <>
      <Button variant="contained" onClick={onClickShow} className="p-2">
        <Typography variant="button">Add Task</Typography>
      </Button>
      <Dialog open={shouldShow}>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        <Button onClick={addTask}>{loading ? 'Saving...' : 'Add'}</Button>
      </Dialog>
    </>
  );
}
