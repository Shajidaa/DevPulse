import type { Request, Response } from 'express';

import * as IssueService from './issues.service';
import { sendResponse } from '../../utils/sendResponse';
import { catchAsync } from '../../middleware/error.middleware';

export const createIssue = catchAsync(async (req: Request, res: Response) => {
  const reporterId = req.user!.id;
  const issue = await IssueService.createIssue(req.body, reporterId);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Issue created successfully',
    data: issue,
  });
});

export const getAllIssues = catchAsync(async (req: Request, res: Response) => {
  const issues = await IssueService.getAllIssues(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    data: issues,
  });
});

export const getSingleIssue = catchAsync(async (req: Request, res: Response) => {
  const issue = await IssueService.getSingleIssue(Number(req.params.id));
  sendResponse(res, {
    statusCode: 200,
    success: true,
    data: issue,
  });
});

export const updateIssue = catchAsync(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const userId = req.user!.id;
  const userRole = req.user!.role;

  const issue = await IssueService.updateIssue(id, userId, userRole, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Issue updated successfully',
    data: issue,
  });
});

export const deleteIssue = catchAsync(async (req: Request, res: Response) => {
  await IssueService.deleteIssue(Number(req.params.id));
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Issue deleted successfully',
    data: null,
  });
});