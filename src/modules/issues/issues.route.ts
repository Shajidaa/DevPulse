import { Router } from 'express';

import * as IssueController from './issues.controller';
import { protect, restrictTo } from '../../middleware/auth.middleware';

const router = Router();

router.post('/', protect, restrictTo('contributor', 'maintainer'), IssueController.createIssue);
router.get('/', IssueController.getAllIssues);
router.get('/:id', IssueController.getSingleIssue);
router.patch('/:id', protect, restrictTo('contributor', 'maintainer'), IssueController.updateIssue);
router.delete('/:id', protect, restrictTo('maintainer'), IssueController.deleteIssue);

export const IssueRoutes = router;