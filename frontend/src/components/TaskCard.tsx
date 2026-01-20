import React from 'react';
import { Task } from '@/types/task';
import Button from './Button';

interface TaskCardProps {
  task: Task;
  onTaskUpdate?: (task: Task) => void;
  onTaskDelete?: (taskId: string) => void;
  onTaskToggle?: (taskId: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onTaskUpdate, onTaskDelete, onTaskToggle }) => {
  const handleToggle = () => {
    if (onTaskToggle) {
      onTaskToggle(task.id);
    }
  };

  const handleDelete = () => {
    if (onTaskDelete) {
      onTaskDelete(task.id);
    }
  };

  const formatDate = (dateString: string | Date) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className={`border rounded-lg p-4 shadow-sm ${task.completed ? 'bg-green-50' : 'bg-white'}`}>
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={handleToggle}
          className="mt-1 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <div className="flex-1 min-w-0">
          <h3 className={`text-lg font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
            {task.title}
          </h3>

          {task.description && (
            <p className={`mt-1 text-sm ${task.completed ? 'text-gray-400' : 'text-gray-600'}`}>
              {task.description}
            </p>
          )}

          <div className="mt-2 flex flex-wrap gap-2 text-xs">
            {task.dueDate && (
              <span className={`px-2 py-1 rounded-full ${new Date(task.dueDate) < new Date() && !task.completed ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                Due: {formatDate(task.dueDate)}
              </span>
            )}

            <span className={`px-2 py-1 rounded-full ${task.completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
              {task.completed ? 'Completed' : 'Pending'}
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onTaskUpdate && onTaskUpdate(task)}
          >
            Edit
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={handleDelete}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;