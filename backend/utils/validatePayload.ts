import { ValidationError } from "@app/core/errors";

type ValidationSchema = {
  validateAsync: (value: unknown, options?: Record<string, unknown>) => Promise<unknown>;
};

const validatePayload = async (schema: ValidationSchema, payload: unknown) => {
  try {
    return await schema.validateAsync(payload, { abortEarly: false });
  } catch (error) {
    const err = error as { details?: unknown };
    throw new ValidationError("Invalid payload", err.details);
  }
};

export { validatePayload };
