import { Request, Response, NextFunction } from 'express';
import { CustomError, IErrorResponse } from './interfaces/error-handler';

export * from './interfaces/error-handler';

// Custom error handler middleware
export const errorHandler = (err: IErrorResponse, _req: Request, res: Response, next: NextFunction): void => {
  if (err instanceof CustomError) {
    res.status(err.statusCode).json(err.serializeErrors());
  }
  next();
};