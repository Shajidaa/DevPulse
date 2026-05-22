import type { Response } from 'express';

interface IResponseData<T> {
  statusCode: number;
  success: boolean;
  message?: string;
  data: T;
}

export const sendResponse = <T>(res: Response, data: IResponseData<T>) => {
  res.status(data.statusCode).json({
    success: data.success,
    message: data.message,
    data: data.data,
  });
};