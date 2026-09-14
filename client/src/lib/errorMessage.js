/**
 * Turns API and authentication failures into a clear, safe message for users.
 * Server-provided messages are preferred because they contain validation details.
 */
export function getErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
  const message = error?.response?.data?.error?.message
    ?? error?.response?.data?.message
    ?? error?.message;

  if (message && !/^(network error|failed to fetch)$/i.test(message)) {
    return message;
  }

  if (!error?.response) {
    return 'We could not reach the server. Check your internet connection and try again.';
  }

  switch (error.response.status) {
    case 400:
      return 'Some information is missing or invalid. Please review the form and try again.';
    case 401:
      return 'Your session has expired. Please sign in again.';
    case 403:
      return 'You do not have permission to do that.';
    case 404:
      return 'We could not find what you requested.';
    case 429:
      return 'Too many attempts. Please wait a moment and try again.';
    default:
      return fallback;
  }
}
