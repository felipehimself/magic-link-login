import { ZodError } from 'zod';

export function searchFormErrors<T>(formValues: ZodError<T>) {
  return formValues.errors.reduce(
    (acc, { message, path }) => {
      const field = path[0] as keyof T;

      if (acc[field] == undefined) {
        acc[field] = message;
      }

      return acc;
    },
    {} as { [K in keyof T]: string },
  );
}
