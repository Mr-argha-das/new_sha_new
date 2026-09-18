// src/lib/response.ts

export function success(
  message: string,
  data: unknown = null,
  status = 200,
  meta?: Record<string, unknown>,
) {
  return Response.json(
    {
      status,
      message,
      data,
      ...(meta && { meta }),
    },
    { status },
  );
}

export const error = (
  message: string,
  status: number = 500,
  errors?: Record<string, string[]>
) =>
  Response.json(
    { status, message, ...(errors ? { errors } : {}) },
    { status }
  );
