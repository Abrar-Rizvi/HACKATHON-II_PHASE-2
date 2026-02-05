import React from 'react';
import Button from '../Button';

interface TodoItem {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: string;
}

interface TodoListPlaceholderProps {
  todos?: TodoItem[];
  onAddTodo?: () => void;
  onToggleTodo?: (id: string) => void;
}

const TodoListPlaceholder: React.FC<TodoListPlaceholderProps> = ({
  todos = [],
  onAddTodo,
  onToggleTodo
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">My Tasks</h2>
        <Button variant="primary" onClick={onAddTodo}>
          Add Task
        </Button>
      </div>

      {todos.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No tasks yet</h3>
          <p className="text-gray-500 mb-4">Get started by creating your first task</p>
          <Button variant="primary" onClick={onAddTodo}>
            Create your first task
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {todos.map(todo => (
            <div
              key={todo.id}
              className={`flex items-center p-4 border border-gray-200 rounded-lg ${
                todo.completed ? 'bg-green-50' : ''
              }`}
            >
              <input
                type="checkbox"
                className="h-5 w-5 text-blue-600 rounded"
                checked={todo.completed}
                onChange={() => onToggleTodo?.(todo.id)}
              />
              <span
                className={`ml-3 text-gray-700 ${
                  todo.completed ? 'line-through text-gray-500' : ''
                }`}
              >
                {todo.title}
              </span>
              {todo.dueDate && (
                <span className="ml-auto text-sm text-gray-500">{todo.dueDate}</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TodoListPlaceholder;