// frontend/src/components/todo/TodoList.tsx
import React from 'react';
import { Task } from '../../types';

interface TodoListProps {
  tasks: Task[];
  onToggleTask: (taskId: string, completed: boolean) => void;
  onDeleteTask: (taskId: string) => void;
  onEditTask?: (task: Task) => void; // Optional prop for editing
}

const TodoList: React.FC<TodoListProps> = ({ tasks, onToggleTask, onDeleteTask, onEditTask }) => {
  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div
          key={task.id}
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
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => onToggleTask(task.id, task.completed)}
              className={`px-3 py-1 rounded text-sm ${
                task.completed
                  ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              {task.completed ? 'Undo' : 'Complete'}
            </button>
            {onEditTask && (
              <button
                onClick={() => onEditTask(task)}
                className="px-3 py-1 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600"
              >
                Edit
              </button>
            )}
            <button
              onClick={() => onDeleteTask(task.id)}
              className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TodoList;