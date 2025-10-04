/**
 * Maps database and API errors to user-friendly messages
 * Prevents information leakage about database schema
 */
export const mapError = (error: any): string => {
  // PostgreSQL error codes
  if (error.code === '23505') { // Unique violation
    if (error.message?.includes('email')) {
      return 'This email is already registered';
    }
    return 'This entry already exists';
  }
  
  if (error.code === '23503') { // Foreign key violation
    return 'Invalid reference data';
  }
  
  if (error.code === '23502') { // Not null violation
    return 'Required field is missing';
  }
  
  if (error.code === '23514') { // Check constraint violation
    return 'The data provided does not meet the requirements';
  }
  
  // Authentication errors
  if (error.message?.includes('JWT') || error.message?.includes('token')) {
    return 'Session expired. Please refresh the page.';
  }
  
  if (error.message?.includes('rate limit')) {
    return 'Too many requests. Please wait a moment and try again.';
  }
  
  // Row level security errors
  if (error.code === '42501' || error.message?.includes('permission')) {
    return 'You do not have permission to perform this action';
  }
  
  // Network errors
  if (error.message?.includes('fetch') || error.message?.includes('network')) {
    return 'Network error. Please check your connection and try again.';
  }
  
  // Generic fallback - never expose internal details
  return 'An error occurred. Please try again or contact support if the problem persists.';
};
