// frontend/src/components/todo/TodoForm.tsx
import React, { useState, useEffect } from 'react';
import { Task } from '../../types';

interface TodoFormProps {
  onSubmit: (taskData: Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => void;
  onCancel?: () => void;
  initialData?: Partial<Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>>;
}

const TodoForm: React.FC<TodoFormProps> = ({ onSubmit, onCancel, initialData }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [titleError, setTitleError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');

  // Validation logic
  useEffect(() => {
    // Validate title
    if (title.trim().length === 0) {
      setTitleError('Title is required');
    } else if (title.length > 100) {
      setTitleError('Title must be 100 characters or less');
    } else {
      setTitleError('');
    }

    // Validate description
    if (description.length > 500) {
      setDescriptionError('Description must be 500 characters or less');
    } else {
      setDescriptionError('');
    }
  }, [title, description]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Final validation check before submission
    const isTitleValid = title.trim().length > 0 && title.length <= 100;
    const isDescriptionValid = description.length <= 500;

    if (isTitleValid && isDescriptionValid) {
      onSubmit({
        title: title.trim(), // Trim whitespace before sending
        description: description || undefined,
        completed: initialData?.completed || false
      });
      setTitle(''); // Reset form after successful submission
      setDescription('');
    }
  };

  const isSubmitDisabled = titleError !== '' || descriptionError !== '';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Title *
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={`w-full px-3 py-2 border ${
            titleError ? 'border-red-500' : 'border-gray-300'
          } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          placeholder="Enter task title"
          maxLength={100}
        />
        {titleError && (
          <p className="mt-1 text-sm text-red-600">{titleError}</p>
        )}
        <div className="text-right text-xs text-gray-500 mt-1">
          {title.length}/100
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={`w-full px-3 py-2 border ${
            descriptionError ? 'border-red-500' : 'border-gray-300'
          } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          rows={3}
          placeholder="Enter task description (optional)"
          maxLength={500}
        />
        {descriptionError && (
          <p className="mt-1 text-sm text-red-600">{descriptionError}</p>
        )}
        <div className="text-right text-xs text-gray-500 mt-1">
          {description.length}/500
        </div>
      </div>

      <div className="flex space-x-3 pt-2">
        <button
          type="submit"
          disabled={isSubmitDisabled}
          className={`px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            isSubmitDisabled
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500'
          }`}
        >
          {initialData ? 'Update Task' : 'Add Task'}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default TodoForm;