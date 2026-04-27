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
  
  // Supabase Auth specific errors
  if (error.message?.includes('Invalid login credentials')) {
    return 'Invalid email or password. Please check your credentials and try again.';
  }
  
  if (error.message?.includes('Email not confirmed')) {
    return 'Please confirm your email address before signing in.';
  }
  
  if (error.message?.includes('User not found')) {
    return 'No account found with this email address.';
  }
  
  if (error.message?.includes('Email already registered') || error.message?.includes('User already registered')) {
    return 'An account with this email already exists. Try signing in instead.';
  }
  
  if (error.message?.includes('Password should be at least')) {
    return 'Password must be at least 8 characters long.';
  }
  
  // OTP / verification token errors (401-style)
  if (
    error.code === 'otp_expired' ||
    error.message?.includes('Token has expired') ||
    error.message?.includes('Invalid token') ||
    error.message?.includes('invalid token') ||
    error.message?.includes('Token has expired or is invalid')
  ) {
    return 'This verification link or code has expired. Please request a new one.';
  }

  // Generic authentication errors
  if (error.message?.includes('JWT') || error.message?.includes('token')) {
    return 'Session expired. Please refresh the page.';
  }

  if (
    error.code === 'over_email_send_rate_limit' ||
    error.message?.includes('email rate limit') ||
    error.message?.includes('over_email_send_rate_limit') ||
    error.message?.includes('For security purposes, you can only request this after')
  ) {
    return 'Too many email requests right now. Please wait a minute before trying again.';
  }

  if (error.status === 429 || error.message?.includes('rate limit')) {
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
  
  // For development: log the actual error (sanitized in production)
  console.error('Unmapped error:', {
    message: error.message,
    code: error.code,
    name: error.name
  });
  
  // If we have a user-friendly error message from Supabase, use it
  if (error.message && typeof error.message === 'string' && !error.message.includes('postgres') && !error.message.includes('database')) {
    return error.message;
  }
  
  // Generic fallback - never expose internal details
  return 'An error occurred. Please try again or contact support if the problem persists.';
};
