import toast from 'react-hot-toast';

/**
 * Toast notification utilities for AstroAI
 * Provides consistent toast styling and behavior across the app
 */

export const showToast = {
  /**
   * Show success toast
   * @param message - Success message to display
   */
  success: (message: string) => toast.success(message, {
    icon: '✅',
    duration: 3000,
    style: {
      background: '#1a1a2e',
      color: '#fff',
      border: '1px solid rgba(34, 197, 94, 0.3)',
      borderRadius: '12px',
      padding: '16px',
      fontSize: '14px',
      fontWeight: '500',
    },
  }),

  /**
   * Show error toast
   * @param message - Error message to display
   */
  error: (message: string) => toast.error(message, {
    icon: '❌',
    duration: 4000,
    style: {
      background: '#1a1a2e',
      color: '#fff',
      border: '1px solid rgba(239, 68, 68, 0.3)',
      borderRadius: '12px',
      padding: '16px',
      fontSize: '14px',
      fontWeight: '500',
    },
  }),

  /**
   * Show loading toast
   * @param message - Loading message to display
   * @returns Toast ID (can be used to dismiss later)
   */
  loading: (message: string) => toast.loading(message, {
    style: {
      background: '#1a1a2e',
      color: '#fff',
      border: '1px solid rgba(99, 102, 241, 0.3)',
      borderRadius: '12px',
      padding: '16px',
      fontSize: '14px',
      fontWeight: '500',
    },
  }),

  /**
   * Show info toast
   * @param message - Info message to display
   */
  info: (message: string) => toast(message, {
    icon: 'ℹ️',
    duration: 3500,
    style: {
      background: '#1a1a2e',
      color: '#fff',
      border: '1px solid rgba(99, 102, 241, 0.3)',
      borderRadius: '12px',
      padding: '16px',
      fontSize: '14px',
      fontWeight: '500',
    },
  }),

  /**
   * Show custom toast with icon
   * @param message - Message to display
   * @param icon - Custom emoji or icon
   */
  custom: (message: string, icon: string) => toast(message, { 
    icon,
    duration: 3000,
    style: {
      background: '#1a1a2e',
      color: '#fff',
      border: '1px solid rgba(99, 102, 241, 0.3)',
      borderRadius: '12px',
      padding: '16px',
      fontSize: '14px',
      fontWeight: '500',
    },
  }),

  /**
   * Show promise toast (loading -> success/error)
   * @param promise - Promise to track
   * @param messages - Loading, success, and error messages
   */
  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    }
  ) => toast.promise(
    promise,
    {
      loading: messages.loading,
      success: messages.success,
      error: messages.error,
    },
    {
      style: {
        background: '#1a1a2e',
        color: '#fff',
        border: '1px solid rgba(99, 102, 241, 0.3)',
        borderRadius: '12px',
        padding: '16px',
        fontSize: '14px',
        fontWeight: '500',
      },
    }
  ),

  /**
   * Dismiss a specific toast or all toasts
   * @param toastId - Optional toast ID to dismiss specific toast
   */
  dismiss: (toastId?: string) => toast.dismiss(toastId),
};

