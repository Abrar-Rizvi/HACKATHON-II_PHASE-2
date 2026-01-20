/**
 * Utility functions for managing loading and error states
 */

export interface LoadingState {
  loading: boolean;
  error: string | null;
  success: string | null;
}

export interface LoadingStateActions {
  startLoading: () => void;
  stopLoading: () => void;
  setError: (error: string) => void;
  setSuccess: (message: string) => void;
  clearError: () => void;
  clearSuccess: () => void;
}

export const createInitialState = (): LoadingState => ({
  loading: false,
  error: null,
  success: null,
});

export const createLoadingReducer = (state: LoadingState, action: { type: string; payload?: any }) => {
  switch (action.type) {
    case 'START_LOADING':
      return { ...state, loading: true, error: null, success: null };
    case 'STOP_LOADING':
      return { ...state, loading: false };
    case 'SET_ERROR':
      return { ...state, error: action.payload, success: null, loading: false };
    case 'SET_SUCCESS':
      return { ...state, success: action.payload, error: null, loading: false };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'CLEAR_SUCCESS':
      return { ...state, success: null };
    default:
      return state;
  }
};