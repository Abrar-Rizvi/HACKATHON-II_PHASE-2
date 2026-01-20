/**
 * Generic API response structure
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
    details?: Record<string, any>;
  };
}

/**
 * Error response structure
 */
export interface ErrorResponse {
  success: boolean;
  error: {
    message: string;
    code?: string;
    details?: Record<string, any>;
  };
}

/**
 * Task API response structure
 */
export interface TaskApiResponse {
  success: boolean;
  data?: Task[];
}

/**
 * Single Task API response structure
 */
export interface SingleTaskApiResponse {
  success: boolean;
  data?: Task;
}