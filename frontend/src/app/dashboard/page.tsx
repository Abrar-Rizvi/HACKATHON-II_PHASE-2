'use client';

import React, { useState } from 'react';
import { Task, CreateTaskRequest, UpdateTaskRequest } from '@/types/task';
import { useAuth } from '@/hooks/useAuth';
import apiClient from '@/lib/api';
import TaskList from '@/components/TaskList';
import TaskForm from '@/components/TaskForm';
import Button from '@/components/Button';
import Card from '@/components/Card';

const DashboardPage = () => {
  const { user, isAuthenticated, isLoading, error: authError, login, signUp, signOut, verifyToken } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load tasks on component mount
  React.useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const fetchedTasks = await apiClient.getTasks();
        setTasks(fetchedTasks);
      } catch (err: any) {
        setError(err.message || 'Failed to load tasks');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleCreateTask = async (taskData: CreateTaskRequest) => {
    try {
      setIsSubmitting(true);
      const newTask = await apiClient.createTask(taskData);
      setTasks([...tasks, newTask]);
      setShowForm(false);
    } catch (err: any) {
      setError(err.message || 'Failed to create task');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateTask = async (taskData: UpdateTaskRequest) => {
    if (!editingTask) return;

    try {
      setIsSubmitting(true);
      const updatedTask = await apiClient.updateTask(editingTask.id, taskData);
      setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
      setEditingTask(null);
      setShowForm(false);
    } catch (err: any) {
      setError(err.message || 'Failed to update task');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      await apiClient.deleteTask(taskId);
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (err: any) {
      setError(err.message || 'Failed to delete task');
    }
  };

  const handleToggleTask = async (taskId: string) => {
    try {
      const updatedTask = await apiClient.toggleTaskCompletion(taskId);
      setTasks(tasks.map(task =>
        task.id === taskId ? updatedTask : task
      ));
    } catch (err: any) {
      setError(err.message || 'Failed to toggle task completion');
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleFormSubmit = (taskData: CreateTaskRequest | UpdateTaskRequest) => {
    if (editingTask) {
      handleUpdateTask(taskData as UpdateTaskRequest);
    } else {
      handleCreateTask(taskData as CreateTaskRequest);
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p>You need to be logged in to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Task Dashboard</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-600">Welcome, {user?.email}</span>
          <Button variant="secondary" onClick={signOut}>Logout</Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <Card>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Your Tasks</h2>
          <Button onClick={() => setShowForm(true)}>
            {showForm ? 'Cancel' : 'Add Task'}
          </Button>
        </div>

        {showForm ? (
          <TaskForm
            task={editingTask || undefined}
            onSubmit={handleFormSubmit}
            onCancel={handleCancelForm}
            isSubmitting={isSubmitting}
          />
        ) : (
          <TaskList
            tasks={tasks}
            loading={loading}
            error={error}
            onTaskUpdate={handleEditTask}
            onTaskDelete={handleDeleteTask}
            onTaskToggle={handleToggleTask}
          />
        )}
      </Card>
    </div>
  );
};

export default DashboardPage;