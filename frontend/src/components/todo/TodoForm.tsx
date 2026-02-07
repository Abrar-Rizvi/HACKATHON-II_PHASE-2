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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-saas-secondary-teal mb-2">
          Title *
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-saas-primary-blue focus:border-saas-primary-blue transition-all duration-200 ${
            titleError ? 'border-saas-accent-red' : 'border-saas-bg-light'
          }`}
          placeholder="Enter task title"
          maxLength={100}
        />
        {titleError && (
          <p className="mt-1 text-sm text-saas-accent-red">{titleError}</p>
        )}
        <div className="text-right text-xs text-saas-secondary-teal mt-1">
          {title.length}/100
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-saas-secondary-teal mb-2">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-saas-primary-blue focus:border-saas-primary-blue transition-all duration-200 ${
            descriptionError ? 'border-saas-accent-red' : 'border-saas-bg-light'
          }`}
          rows={3}
          placeholder="Enter task description (optional)"
          maxLength={500}
        />
        {descriptionError && (
          <p className="mt-1 text-sm text-saas-accent-red">{descriptionError}</p>
        )}
        <div className="text-right text-xs text-saas-secondary-teal mt-1">
          {description.length}/500
        </div>
      </div>

      <div className="flex space-x-4 pt-2">
        <button
          type="submit"
          disabled={isSubmitDisabled}
          className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
            isSubmitDisabled
              ? 'bg-saas-primary-blue/70 text-white cursor-not-allowed'
              : 'bg-saas-primary-blue text-white hover:bg-[#5a8bad] active:scale-[0.98] focus:ring-2 focus:ring-offset-2 focus:ring-saas-primary-blue'
          }`}
        >
          {initialData ? 'Update Task' : 'Add Task'}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 bg-saas-bg-light text-saas-secondary-teal rounded-lg hover:bg-saas-bg-light/80 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-saas-primary-blue"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default TodoForm;