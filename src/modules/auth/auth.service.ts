import bcrypt from 'bcrypt';
import type { IUser } from './auth.interface';
import { pool } from '../../db';
import jwt from 'jsonwebtoken';
export const query = async (text: string, params?: any[]) => {
  return pool.query(text, params);
};



export const registerUser = async (userData: Partial<IUser>): Promise<IUser> => {
  const { name, email, password, role = 'contributor' } = userData;

  if (!name || !email || !password) {
    throw new Error('Please provide name, email and password');
  }


  const existingUser = await query('SELECT id FROM users WHERE email = $1', [email]);
  if (existingUser.rowCount && existingUser.rowCount > 0) {
    throw new Error('User with this email already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const sql = `
    INSERT INTO users (name, email, password, role)
    VALUES ($1, $2, $3, $4)
    RETURNING id, name, email, role, created_at, updated_at;
  `;
  
  const result = await query(sql, [name, email, hashedPassword, role]);
  return result.rows[0];
};

export const loginUser = async (credentials: Partial<IUser>): Promise<{ token: string; user: IUser }> => {
  const { email, password } = credentials;

  if (!email || !password) {
    throw new Error( 'Please provide email and password');
  }

  const sql = 'SELECT * FROM users WHERE email = $1';
  const result = await query(sql, [email]);

  if (result.rowCount === 0) {
    throw new Error( 'Invalid email or password');
  }

  const user = result.rows[0];
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error( 'Invalid email or password');
  }


  const tokenPayload = { id: user.id, name: user.name, role: user.role };
  const token = jwt.sign(tokenPayload, process.env.JWT_SECRET as string, { expiresIn: '1d' });

  delete user.password; 

  return { token, user };
};