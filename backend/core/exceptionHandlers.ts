import { NextFunction, Request, Response } from "express";
import { AppError } from "@app/core/errors";

const exceptionHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  next: NextFunction
): Response | void => {
  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message,
      code: err.code,
      details: err.details ?? null,
    });
  }

  return res.status(500).json({
    message: "Internal server error",
    code: "internal_error",
  });
};

export { exceptionHandler };
