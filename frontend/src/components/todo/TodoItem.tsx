// frontend/src/components/todo/TodoItem.tsx
import React from 'react';
import { Task } from '../../types';

interface TodoItemProps {
  task: Task;
  onToggle: (taskId: string, completed: boolean) => void;
  onDelete: (taskId: string) => void;
  onEdit?: (task: Task) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ task, onToggle, onDelete, onEdit }) => {
  return (
    <div
      className={`p-4 border rounded-lg flex justify-between items-center ${
        task.completed ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
      }`}
    >
      <div>
        <h3 className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
          {task.title}
        </h3>
        {task.description && (
          <p className="text-sm text-gray-600 mt-1">{task.description}</p>
        )}
        <p className="text-xs text-gray-500 mt-1">
          Created: {new Date(task.created_at).toLocaleDateString()}
        </p>
      </div>
      <div className="flex space-x-2">
        <button
          onClick={() => onToggle(task.id, task.completed)}
          className={`px-3 py-1 rounded text-sm ${
            task.completed
              ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          {task.completed ? 'Undo' : 'Complete'}
        </button>
        {onEdit && (
          <button
            onClick={() => onEdit(task)}
            className="px-3 py-1 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600"
          >
            Edit
          </button>
        )}
        <button
          onClick={() => onDelete(task.id)}
          className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TodoItem;