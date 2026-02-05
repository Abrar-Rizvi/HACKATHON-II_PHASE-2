'use client'
import React, { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Task } from '@/types';
import { apiClient } from '@/lib/api';
import TodoList from '@/components/todo/TodoList';
import TodoForm from '@/components/todo/TodoForm';

const DashboardPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const tasksData = await apiClient.getTasks();
        setTasks(tasksData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch tasks');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleAddTask = async (taskData: Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      const newTask = await apiClient.createTask({
        ...taskData,
        completed: taskData.completed ?? false  // Ensure completed is set to false by default
      });
      setTasks(prevTasks => [...prevTasks, newTask]);
      setShowForm(false);
      // Clear any previous errors on successful task creation
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create task');
    }
  };

  const handleUpdateTask = async (taskData: Partial<Task>) => {
    if (!editingTask) return;

    try {
      const updatedTask = await apiClient.updateTask(editingTask.id, taskData);
      setTasks(prevTasks => prevTasks.map(task => task.id === editingTask.id ? updatedTask : task));
      setEditingTask(null);
      // Clear any previous errors on successful task update
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task');
    }
  };

  const handleToggleTask = async (taskId: string, currentCompleted: boolean) => {
    try {
      const updatedTask = await apiClient.toggleTaskCompletion(taskId, !currentCompleted);
      setTasks(prevTasks => prevTasks.map(task =>
        task.id === taskId ? updatedTask : task
      ));
      // Clear any previous errors on successful task toggle
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await apiClient.deleteTask(taskId);
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
      // Clear any previous errors on successful task deletion
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete task');
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 py-12">
          <div className="container mx-auto px-4">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>
              <div className="text-center py-12">
                <p>Loading tasks...</p>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                {showForm ? (
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-4">
                      {editingTask ? 'Edit Task' : 'Create New Task'}
                    </h2>
                    <TodoForm
                      onSubmit={editingTask ? handleUpdateTask : handleAddTask}
                      onCancel={() => {
                        setShowForm(false);
                        setEditingTask(null);
                      }}
                      initialData={editingTask ? {
                        title: editingTask.title,
                        description: editingTask.description,
                        completed: editingTask.completed
                      } : undefined}
                    />
                  </div>
                ) : (
                  <button
                    onClick={() => setShowForm(true)}
                    className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Create New Task
                  </button>
                )}

                {tasks.length > 0 ? (
                  <TodoList
                    tasks={tasks}
                    onToggleTask={handleToggleTask}
                    onDeleteTask={handleDeleteTask}
                    onEditTask={handleEditTask}
                  />
                ) : (
                  <div className="text-center py-12">
                    <h3 className="text-xl font-medium text-gray-900 mb-2">No tasks yet</h3>
                    <p className="text-gray-600 mb-4">Get started by creating your first task</p>
                    <button
                      onClick={() => setShowForm(true)}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Create your first task
                    </button>
                  </div>
                )}
              </div>

              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Statistics</h3>

                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-700">{tasks.length}</p>
                      <p className="text-sm text-gray-600">Total Tasks</p>
                    </div>

                    <div className="p-4 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-700">
                        {tasks.filter(t => t.completed).length}
                      </p>
                      <p className="text-sm text-gray-600">Completed</p>
                    </div>

                    <div className="p-4 bg-yellow-50 rounded-lg">
                      <p className="text-2xl font-bold text-yellow-700">
                        {tasks.filter(t => !t.completed).length}
                      </p>
                      <p className="text-sm text-gray-600">Pending</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Upcoming</h3>

                  <div className="space-y-3">
                    <div className="p-3 border border-gray-200 rounded">
                      <p className="font-medium">Team Meeting</p>
                      <p className="text-sm text-gray-500">Mon, 10:00 AM</p>
                    </div>

                    <div className="p-3 border border-gray-200 rounded">
                      <p className="font-medium">Project Deadline</p>
                      <p className="text-sm text-gray-500">Wed, 5:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default DashboardPage;