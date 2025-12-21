/**
 * Standardized error codes for API responses
 */
export enum ErrorCode {
  // Authentication errors
  AUTH_ERROR = 'AUTH_ERROR',
  UNAUTHORIZED = 'UNAUTHORIZED',
  
  // Validation errors
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_INPUT = 'INVALID_INPUT',
  
  // API errors
  API_ERROR = 'API_ERROR',
  OPENAI_ERROR = 'OPENAI_ERROR',
  
  // Network errors
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  
  // Database errors
  DATABASE_ERROR = 'DATABASE_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  
  // Rate limiting
  RATE_LIMIT_ERROR = 'RATE_LIMIT_ERROR',
  
  // General errors
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

/**
 * Standardized error response format
 */
export interface ApiErrorResponse {
  error: string;
  code: ErrorCode;
  details?: unknown;
  message?: string; // User-friendly message
}

/**
 * Create a standardized API error response
 */
export function createErrorResponse(
  error: string,
  code: ErrorCode,
  details?: unknown,
  message?: string
): ApiErrorResponse {
  return {
    error,
    code,
    details,
    message: message || getUserFriendlyMessage(code, error),
  };
}

/**
 * Get user-friendly error messages based on error code
 */
export function getUserFriendlyMessage(code: ErrorCode, fallback?: string): string {
  const messages: Record<ErrorCode, string> = {
    [ErrorCode.AUTH_ERROR]: 'Authentication failed. Please log in again.',
    [ErrorCode.UNAUTHORIZED]: 'You do not have permission to access this resource.',
    
    [ErrorCode.VALIDATION_ERROR]: 'The provided data is invalid. Please check your input.',
    [ErrorCode.INVALID_INPUT]: 'Invalid input provided. Please correct the errors and try again.',
    
    [ErrorCode.API_ERROR]: 'An error occurred while processing your request. Please try again.',
    [ErrorCode.OPENAI_ERROR]: 'AI service is temporarily unavailable. Please try again in a moment.',
    
    [ErrorCode.NETWORK_ERROR]: 'Network connection lost. Please check your internet connection.',
    [ErrorCode.TIMEOUT_ERROR]: 'Request timed out. Please try again.',
    
    [ErrorCode.DATABASE_ERROR]: 'Database error occurred. Please try again later.',
    [ErrorCode.NOT_FOUND]: 'The requested resource was not found.',
    
    [ErrorCode.RATE_LIMIT_ERROR]: 'Too many requests. Please wait a moment before trying again.',
    
    [ErrorCode.INTERNAL_ERROR]: 'An internal error occurred. Please try again later.',
    [ErrorCode.UNKNOWN_ERROR]: 'An unexpected error occurred. Please try again.',
  };

  return messages[code] || fallback || 'An error occurred.';
}

/**
 * Format error for logging
 */
export function formatErrorForLog(error: unknown): string {
  if (error instanceof Error) {
    return `${error.name}: ${error.message}\n${error.stack || ''}`;
  }
  return String(error);
}

/**
 * Determine error code from error object
 */
export function getErrorCode(error: unknown): ErrorCode {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    
    // Check for specific error patterns
    if (message.includes('unauthorized') || message.includes('authentication')) {
      return ErrorCode.AUTH_ERROR;
    }
    if (message.includes('validation') || message.includes('invalid')) {
      return ErrorCode.VALIDATION_ERROR;
    }
    if (message.includes('openai') || message.includes('ai service')) {
      return ErrorCode.OPENAI_ERROR;
    }
    if (message.includes('network') || message.includes('connection')) {
      return ErrorCode.NETWORK_ERROR;
    }
    if (message.includes('timeout')) {
      return ErrorCode.TIMEOUT_ERROR;
    }
    if (message.includes('not found')) {
      return ErrorCode.NOT_FOUND;
    }
    if (message.includes('rate limit')) {
      return ErrorCode.RATE_LIMIT_ERROR;
    }
    if (message.includes('database')) {
      return ErrorCode.DATABASE_ERROR;
    }
  }
  
  return ErrorCode.UNKNOWN_ERROR;
}

/**
 * Check if error is a client error (4xx)
 */
export function isClientError(statusCode: number): boolean {
  return statusCode >= 400 && statusCode < 500;
}

/**
 * Check if error is a server error (5xx)
 */
export function isServerError(statusCode: number): boolean {
  return statusCode >= 500 && statusCode < 600;
}

/**
 * Parse API error response
 */
export function parseApiError(response: unknown): ApiErrorResponse {
  if (
    typeof response === 'object' &&
    response !== null &&
    'error' in response &&
    'code' in response
  ) {
    return response as ApiErrorResponse;
  }

  // Fallback for non-standard error responses
  return createErrorResponse(
    'An error occurred',
    ErrorCode.UNKNOWN_ERROR,
    response
  );
}

