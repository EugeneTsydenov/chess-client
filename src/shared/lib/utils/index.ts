import { ClassValue, clsx } from 'clsx';
import { UseFormSetError } from 'react-hook-form';
import { toast as toastify, ToastOptions } from 'react-toastify';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const deepClone = <T>(object: T): T =>
  JSON.parse(JSON.stringify(object));

export const handleValidationError = (
  errors: Array<{ field: string; message: string }>,
  setError: UseFormSetError<any>,
) => {
  errors.forEach((e) => {
    setError(
      e.field,
      { type: 'custom', message: e.message },
      { shouldFocus: true },
    );
  });
};

type ErrorHandler = () => void;

export const handleError = (
  statusCode: number,
  handlers: Record<string | number, ErrorHandler>,
  defaultHandler: ErrorHandler,
) => {
  if (handlers[statusCode]) {
    handlers[statusCode]();
    return;
  }

  for (const key in handlers) {
    const parsedKey = JSON.parse(key);

    if (Array.isArray(parsedKey)) {
      if (parsedKey.includes(statusCode)) {
        handlers[key]();
        return;
      }
    }
  }

  defaultHandler();
};

export function toast(content: string, options?: ToastOptions) {
  toastify(content, {
    position: 'bottom-right',
    theme: 'dark',
    closeOnClick: true,
    pauseOnHover: true,
    type: 'success',
    ...options,
  });
}
