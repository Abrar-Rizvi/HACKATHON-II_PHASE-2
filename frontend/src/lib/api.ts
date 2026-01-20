import { Task, CreateTaskRequest, UpdateTaskRequest } from '@/types/task';
import { LoginRequest, RegisterRequest, LoginResponse, RegisterResponse } from '@/types/user';
import { ApiResponse, SingleTaskApiResponse, TaskApiResponse, ErrorResponse } from '@/types/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8001/api';

class ApiClient {
  private token: string | null = null;

  setToken(token: string | null) {
    this.token = token;
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  private async checkAndRefreshToken(): Promise<boolean> {
    if (!this.token) {
      return false;
    }

    // Check if token is expired by decoding JWT (basic check without verification)
    try {
      const parts = this.token.split('.');
      if (parts.length !== 3) {
        return false;
      }

      const payload = JSON.parse(atob(parts[1]));
      const currentTime = Math.floor(Date.now() / 1000);

      // If token expires in the next 5 minutes, consider it expired
      if (payload.exp && payload.exp < currentTime + 300) {
        // Token is expired or will expire soon
        return false;
      }
    } catch (e) {
      console.error('Error decoding token:', e);
      return false;
    }

    return true;
  }

  // AUTHENTICATION METHODS
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Login failed');
    }

    // Store token for future requests
    if (data.token) {
      this.setToken(data.token);
    }

    return data;
  }

  // Internal method to make authenticated requests with error handling
  private async authenticatedRequest(url: string, options: RequestInit = {}) {
    // Check if token is still valid
    const isValid = await this.checkAndRefreshToken();
    if (!isValid) {
      // Token is invalid/expired, we'll proceed with the request but expect a 401
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    });

    if (response.status === 401) {
      // Token expired, clear it
      this.setToken(null);
      throw new Error('Authentication token expired. Please log in again.');
    }

    return response;
  }

  async register(userData: RegisterRequest): Promise<RegisterResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Registration failed');
    }

    // Store token for future requests
    if (data.token) {
      this.setToken(data.token);
    }

    return data;
  }

  async logout(): Promise<void> {
    // Clear the stored token
    this.setToken(null);
  }

  // TASK METHODS
  async getTasks(): Promise<Task[]> {
    const response = await this.authenticatedRequest(`${API_BASE_URL}/tasks`, {
      method: 'GET',
    });

    const data: TaskApiResponse = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to fetch tasks');
    }

    return data.data || [];
  }

  async createTask(taskData: CreateTaskRequest): Promise<Task> {
    const response = await this.authenticatedRequest(`${API_BASE_URL}/tasks`, {
      method: 'POST',
      body: JSON.stringify(taskData),
    });

    const data: SingleTaskApiResponse = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to create task');
    }

    return data.data!;
  }

  async getTaskById(id: string): Promise<Task> {
    const response = await this.authenticatedRequest(`${API_BASE_URL}/tasks/${id}`, {
      method: 'GET',
    });

    const data: SingleTaskApiResponse = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to fetch task');
    }

    return data.data!;
  }

  async updateTask(id: string, taskData: UpdateTaskRequest): Promise<Task> {
    const response = await this.authenticatedRequest(`${API_BASE_URL}/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(taskData),
    });

    const data: SingleTaskApiResponse = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to update task');
    }

    return data.data!;
  }

  async deleteTask(id: string): Promise<boolean> {
    const response = await this.authenticatedRequest(`${API_BASE_URL}/tasks/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData: ErrorResponse = await response.json();
      throw new Error(errorData.error?.message || 'Failed to delete task');
    }

    return response.status === 200 || response.status === 204;
  }

  async toggleTaskCompletion(id: string): Promise<Task> {
    const response = await this.authenticatedRequest(`${API_BASE_URL}/tasks/${id}/toggle`, {
      method: 'PATCH',
    });

    const data: SingleTaskApiResponse = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to toggle task completion');
    }

    return data.data!;
  }
}

// Create a singleton instance
export const apiClient = new ApiClient();

export default apiClient;