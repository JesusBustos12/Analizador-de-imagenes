import mysql from 'mysql2/promise';
import { env } from './config/env.js';

// Limpiamos ?ssl=true del URI ya que mysql2 falla si lo parsea como booleano en el string de conexión
const cleanUri = env.DATABASE_URL.replace('?ssl=true', '');

// Create the connection pool
const db = mysql.createPool({
  uri: cleanUri,
  ssl: {
    rejectUnauthorized: true, // Requerido por TiDB Cloud
  },
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10,
  idleTimeout: 60000,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

// Initialize database schema (users table)
export const initDb = async () => {
  try {
    console.log('Verifying TiDB Cloud connection and schema...');
    const connection = await db.getConnection();
    
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        daily_analyses_count INT DEFAULT 0,
        last_analysis_date DATE
      )
    `);
    
    // Add columns to existing table if they don't exist
    try {
      await connection.execute('ALTER TABLE users ADD COLUMN daily_analyses_count INT DEFAULT 0');
    } catch (e) { /* column exists */ }
    
    try {
      await connection.execute('ALTER TABLE users ADD COLUMN last_analysis_date DATE');
    } catch (e) { /* column exists */ }
    
    connection.release();
    console.log('TiDB connected and schema initialized successfully.');
  } catch (error) {
    console.error('Failed to initialize TiDB database:', error);
  }
};

export default db;
