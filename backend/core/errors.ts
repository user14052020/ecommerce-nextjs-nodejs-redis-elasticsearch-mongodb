class AppError extends Error {
  statusCode: number;
  code: string;
  details?: unknown;

  constructor(message: string, statusCode: number, code: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
  }
}

class ValidationError extends AppError {
  details: unknown;

  constructor(message?: string, details?: unknown) {
    super(message || "Validation failed", 400, "validation_error");
    this.details = details;
  }
}

class NotFoundError extends AppError {
  constructor(message?: string) {
    super(message || "Not found", 404, "not_found");
  }
}

class ForbiddenError extends AppError {
  constructor(message?: string) {
    super(message || "Forbidden", 403, "forbidden");
  }
}

export {
  AppError,
  ValidationError,
  NotFoundError,
  ForbiddenError,
};
