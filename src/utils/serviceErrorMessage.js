const GENERIC_SERVICE_ERROR = 'We could not load flight results. Please try again.';

export function getServiceErrorMessage(error) {
  const message = String(error?.message ?? '').trim();

  if (message.length === 0) {
    return GENERIC_SERVICE_ERROR;
  }

  return message;
}
