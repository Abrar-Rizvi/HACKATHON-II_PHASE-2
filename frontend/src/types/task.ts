/**
 * Task type definition with all required fields and validation rules
 */
export interface Task {
  id: string;
  title: string;
  description?: string | null;
  completed: boolean;
  dueDate?: Date | string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  userId: string;
}

/**
 * Task creation request payload
 */
export interface CreateTaskRequest {
  title: string;
  description?: string | null;
  dueDate?: Date | string | null;
}

/**
 * Task update request payload
 */
export interface UpdateTaskRequest {
  title?: string;
  description?: string | null;
  dueDate?: Date | string | null;
  completed?: boolean;
}