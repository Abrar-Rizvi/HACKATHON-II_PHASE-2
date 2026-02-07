// frontend/src/components/todo/TodoList.tsx
import React, { useState } from 'react';
import { Task } from '../../types';

interface TodoListProps {
  tasks: Task[];
  onToggleTask: (taskId: string, completed: boolean) => void;
  onDeleteTask: (taskId: string) => void;
  onEditTask?: (task: Task) => void; // Optional prop for editing
}

const TodoList: React.FC<TodoListProps> = ({ tasks, onToggleTask, onDeleteTask, onEditTask }) => {
  const [hoveredTaskId, setHoveredTaskId] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div
          key={task.id}
          className={`p-5 rounded-xl border transition-all duration-200 ${
            task.completed
              ? 'bg-gradient-to-r from-green-50/50 to-green-100/30 border-green-200'
              : 'bg-white border-saas-bg-light hover:border-saas-primary-blue/30 shadow-sm hover:shadow-md'
          }`}
          onMouseEnter={() => setHoveredTaskId(task.id)}
          onMouseLeave={() => setHoveredTaskId(null)}
        >
          <div className="flex justify-between items-start">
            <div className="flex-1 min-w-0">
              <h3 className={`font-medium text-lg ${task.completed ? 'line-through text-saas-secondary-teal' : 'text-saas-primary-blue'}`}>
                {task.title}
              </h3>
              {task.description && (
                <p className="text-saas-secondary-teal mt-2 text-sm">{task.description}</p>
              )}
              <div className="mt-3 text-xs text-saas-secondary-teal">
                {new Date(task.created_at).toLocaleDateString()}
              </div>
            </div>

            {/* Action icons container - visible only on hover */}
            <div className={`flex items-center space-x-2 transition-opacity duration-300 ${
              hoveredTaskId === task.id ? 'opacity-100' : 'opacity-0'
            }`}>
              <button
                onClick={() => onToggleTask(task.id, task.completed)}
                className={`p-2 rounded-full ${
                  task.completed
                    ? 'bg-green-100 text-green-600 hover:bg-green-200'
                    : 'bg-saas-primary-blue/10 text-saas-primary-blue hover:bg-saas-primary-blue/20'
                }`}
                title={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
              >
                {task.completed ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>

              {onEditTask && (
                <button
                  onClick={() => onEditTask(task)}
                  className="p-2 rounded-full bg-saas-secondary-teal/10 text-saas-secondary-teal hover:bg-saas-secondary-teal/20"
                  title="Edit task"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </button>
              )}

              <button
                onClick={() => onDeleteTask(task.id)}
                className="p-2 rounded-full bg-saas-accent-red/10 text-saas-accent-red hover:bg-saas-accent-red/20"
                title="Delete task"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TodoList;