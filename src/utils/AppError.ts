export class AppError extends Error {
  public statusCode: number;
  public errors?: any;

  constructor(statusCode: number, message: string, errors?: any) {
    
    super(message);
    
    this.statusCode = statusCode;
    this.errors = errors;

 
    Object.setPrototypeOf(this, AppError.prototype);


    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}