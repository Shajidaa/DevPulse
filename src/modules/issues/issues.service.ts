import { query } from "../auth/auth.service";
import type { IIssue, IIssueQueryFilters } from "./issues.interface";



//created issue
export const createIssue = async (issueData: Partial<IIssue>, reporterId: number): Promise<IIssue> => {
  const { title, description, type } = issueData;

  if (!title || title.length > 150) {
    throw new Error('Title is required and must not exceed 150 characters');
  }
  if (!description || description.length < 20) {
    throw new Error('Description is required and must be at least 20 characters');
  }
  if (type !== 'bug' && type !== 'feature_request') {
    throw new Error('Type must be either bug or feature_request');
  }

  const sql = `
    INSERT INTO issues (title, description, type, reporter_id)
    VALUES ($1, $2, $3, $4)
    RETURNING id, title, description, type, status, reporter_id, created_at, updated_at;
  `;

  const result = await query(sql, [title, description, type, reporterId]);
  return result.rows[0];
};
//get all issues
export const getAllIssues = async (filters: IIssueQueryFilters): Promise<any[]> => {
  const { sort = 'newest', type, status } = filters;
  
  const queryParams: any[] = [];
  let sql = 'SELECT * FROM issues';
  let conditions: string[] = [];

  if (type) {
    queryParams.push(type);
    conditions.push(`type = $${queryParams.length}`);
  }

  if (status) {
    queryParams.push(status);
    conditions.push(`status = $${queryParams.length}`);
  }

  if (conditions.length > 0) {
    sql += ' WHERE ' + conditions.join(' AND ');
  }

  sql += sort === 'oldest' ? ' ORDER BY created_at ASC' : ' ORDER BY created_at DESC';

  const issueResult = await query(sql, queryParams);
  const issues = issueResult.rows;

  if (issues.length === 0) return [];

  // Critical Requirement validation alternative to JOINs: Extract IDs and execute secondary selective query batching
  const reporterIds = Array.from(new Set(issues.map((issue) => issue.reporter_id)));
  
  const userSql = `SELECT id, name, role FROM users WHERE id IN (${reporterIds.map((_, i) => `$${i + 1}`).join(',')})`;
  const userResult = await query(userSql, reporterIds);
  
  const userMap = new Map(userResult.rows.map((user) => [user.id, user]));

  return issues.map((issue) => {
    const reporter = userMap.get(issue.reporter_id) || null;
    const { reporter_id, ...issueData } = issue;
    return { ...issueData, reporter };
  });
};
//get single issue
export const getSingleIssue = async (id: number): Promise<any> => {
  const issueSql = 'SELECT * FROM issues WHERE id = $1';
  const issueResult = await query(issueSql, [id]);

  if (issueResult.rowCount === 0) {
    throw new Error('Issue not found');
  }

  const issue = issueResult.rows[0];

  const userSql = 'SELECT id, name, role FROM users WHERE id = $1';
  const userResult = await query(userSql, [issue.reporter_id]);
  const reporter = userResult.rows[0] || null;

  const { reporter_id, ...issueData } = issue;
  return { ...issueData, reporter };
};
//update issue
export const updateIssue = async (
  id: number,
  userId: number,
  userRole: string,
  updateFields: Partial<IIssue>
): Promise<IIssue> => {
  const currentIssueSql = 'SELECT * FROM issues WHERE id = $1';
  const currentIssueRes = await query(currentIssueSql, [id]);

  if (currentIssueRes.rowCount === 0) {
    throw new Error('Issue not found');
  }

  const currentIssue = currentIssueRes.rows[0];

  // Business access matrix rule evaluation
  if (userRole !== 'maintainer') {
    if (currentIssue.reporter_id !== userId) {
      throw new Error('Forbidden: You cannot modify another contributor\'s issue');
    }
    if (currentIssue.status !== 'open') {
      throw new Error('Conflict: Contributors can only edit issues in open status');
    }
  }

  const title = updateFields.title || currentIssue.title;
  const description = updateFields.description || currentIssue.description;
  const type = updateFields.type || currentIssue.type;
  const status = updateFields.status || currentIssue.status;

  const updateSql = `
    UPDATE issues 
    SET title = $1, description = $2, type = $3, status = $4, updated_at = NOW()
    WHERE id = $5
    RETURNING id, title, description, type, status, reporter_id, created_at, updated_at;
  `;

  const result = await query(updateSql, [title, description, type, status, id]);
  return result.rows[0];
};
//delete issue
export const deleteIssue = async (id: number): Promise<void> => {
  const checkSql = 'SELECT id FROM issues WHERE id = $1';
  const checkRes = await query(checkSql, [id]);

  if (checkRes.rowCount === 0) {
    throw new Error('Issue not found');
  }

  await query('DELETE FROM issues WHERE id = $1', [id]);
};