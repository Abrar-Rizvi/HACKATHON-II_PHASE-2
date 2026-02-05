// frontend/src/lib/api.ts
import { Task } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

/**
 * Centralized API client with JWT attachment for all requests
 */
class ApiClient {
  /**
   * Get the JWT token from localStorage
   */
  private getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  }

  /**
   * Create headers with JWT token
   */
  private getAuthHeaders(): HeadersInit {
    const token = this.getToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  /**
   * Handle API response and errors
   */
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (parseError) {
        // If response is not JSON, create a generic error
        throw new Error(`Request failed with status ${response.status}: ${response.statusText}`);
      }

      // Extract the detailed error message from the backend validation error
      let errorMessage = errorData.message || `Request failed with status ${response.status}`;

      // For validation errors (422), the backend returns a structured error
      if (response.status === 422 && errorData.detail && typeof errorData.detail === 'object') {
        errorMessage = errorData.detail.message || errorData.message || 'Validation error occurred';
      } else if (response.status === 422) {
        // Handle the case where detail is a string
        errorMessage = errorData.detail || errorData.message || 'Validation error occurred';
      }

      // Throw standardized error with the extracted message
      throw new Error(errorMessage);
    }

    // For 204 No Content responses, return null
    if (response.status === 204) {
      return null as T;
    }

    const data = await response.json();

    // Transform datetime strings to ISO strings if needed
    // The backend returns datetime objects that may need conversion
    if (response.url.includes('/tasks')) {
      if (Array.isArray(data)) {
        // Handle array of tasks
        return data.map(task => this.transformTaskDates(task)) as unknown as T;
      } else {
        // Handle single task
        return this.transformTaskDates(data) as unknown as T;
      }
    }

    return data as T;
  }

  /**
   * Transform task date fields from datetime objects to ISO strings
   */
  private transformTaskDates(task: any) {
    if (task && typeof task === 'object') {
      // Check if created_at is a datetime object and convert to ISO string
      if (task.created_at && typeof task.created_at === 'object' && task.created_at.toString) {
        task.created_at = new Date(task.created_at).toISOString();
      } else if (task.created_at && typeof task.created_at === 'string' && !isNaN(Date.parse(task.created_at))) {
        // Ensure it's a valid date string
        task.created_at = new Date(task.created_at).toISOString();
      }

      // Check if updated_at is a datetime object and convert to ISO string
      if (task.updated_at && typeof task.updated_at === 'object' && task.updated_at.toString) {
        task.updated_at = new Date(task.updated_at).toISOString();
      } else if (task.updated_at && typeof task.updated_at === 'string' && !isNaN(Date.parse(task.updated_at))) {
        // Ensure it's a valid date string
        task.updated_at = new Date(task.updated_at).toISOString();
      }
    }
    return task;
  }

  /**
   * Get all tasks for the authenticated user
   */
  async getTasks(): Promise<Task[]> {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse<Task[]>(response);
  }

  /**
   * Create a new task
   */
  async createTask(taskData: Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Task> {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(taskData),
    });

    return this.handleResponse<Task>(response);
  }

  /**
   * Update a task
   */
  async updateTask(taskId: string, taskData: Partial<Task>): Promise<Task> {
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(taskData),
    });

    return this.handleResponse<Task>(response);
  }

  /**
   * Toggle task completion status
   */
  async toggleTaskCompletion(taskId: string, completed: boolean): Promise<Task> {
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ completed }),
    });

    return this.handleResponse<Task>(response);
  }

  /**
   * Delete a task
   */
  async deleteTask(taskId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    await this.handleResponse<void>(response);
  }

  /**
   * Get a specific task by ID
   */
  async getTaskById(taskId: string): Promise<Task> {
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse<Task>(response);
  }
}

export const apiClient = new ApiClient();