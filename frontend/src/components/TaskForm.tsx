'use client';

import React, { useState, useEffect } from 'react';
import { Task, CreateTaskRequest, UpdateTaskRequest } from '@/types/task';
import Input from './Input';
import Button from './Button';

interface TaskFormProps {
  task?: Task;
  onSubmit: (taskData: CreateTaskRequest | UpdateTaskRequest) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const TaskForm: React.FC<TaskFormProps> = ({ task, onSubmit, onCancel, isSubmitting = false }) => {
  const [formData, setFormData] = useState<CreateTaskRequest | UpdateTaskRequest>({
    title: task?.title || '',
    description: task?.description || '',
    dueDate: task?.dueDate || ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Title *"
        name="title"
        value={typeof formData.title === 'string' ? formData.title : ''}
        onChange={handleChange}
        required
        placeholder="Enter task title"
      />

      <Input
        label="Description"
        name="description"
        value={typeof formData.description === 'string' ? formData.description : ''}
        onChange={handleChange}
        placeholder="Enter task description"
      />

      <Input
        label="Due Date"
        name="dueDate"
        type="date"
        value={formData.dueDate ? (formData.dueDate as string).split('T')[0] : ''}
        onChange={handleChange}
        placeholder="Select due date"
      />

      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          isLoading={isSubmitting}
        >
          {task ? 'Update Task' : 'Create Task'}
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;