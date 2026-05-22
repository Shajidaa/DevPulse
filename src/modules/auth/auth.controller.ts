

import type { Request, Response } from 'express';
import * as AuthService from './auth.service';
import { sendResponse } from '../../utils/sendResponse';


export const signup = (async (req: Request, res: Response) => {
  const user = await AuthService.registerUser(req.body);
  sendResponse
  (res, {
    statusCode: 201,
    success: true,
    message: 'User registered successfully',
    data: user,
  });
});

export const login = (async (req: Request, res: Response) => {
  const payload = await AuthService.loginUser(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Login successful',
    data: payload,
  });
});