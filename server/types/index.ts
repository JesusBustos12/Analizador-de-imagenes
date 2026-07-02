import { Request } from 'express';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export interface UserPayload {
  id: string;
  name: string;
  email: string;
  daily_analyses_count?: number;
}

export interface AuthRequest extends Request {
  user?: UserPayload;
}

export interface UserRow extends RowDataPacket {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  created_at: Date;
  daily_analyses_count: number;
  last_analysis_date: Date | null;
  is_today?: number;
}
