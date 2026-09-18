const path = require('path');
require('dotenv').config();

/**
 * Database Configuration
 * 
 * Production (VPS): Uses MySQL when DB_HOST is set in .env
 * Development (Local): Falls back to SQLite when DB_PATH is set or no DB_HOST
 */

let pool;

if (process.env.DB_HOST) {
  // ============ PRODUCTION: MySQL ============
  const mysql = require('mysql2/promise');
  
  pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  console.log('✅ Database: MySQL connected');

} else {
  // ============ DEVELOPMENT: SQLite ============
  const Database = require('better-sqlite3');
  
  const dbPath = process.env.DB_PATH || path.join(__dirname, '../../database.sqlite');
  const sqliteDb = new Database(dbPath);
  sqliteDb.pragma('journal_mode = WAL');

  class SQLiteConnection {
    constructor(db) {
      this.db = db;
      this.inTransaction = false;
    }
    async beginTransaction() {
      this.db.exec('BEGIN TRANSACTION');
      this.inTransaction = true;
    }
    async execute(sql, params = []) {
      return executeQuery(this.db, sql, params);
    }
    async commit() {
      if (this.inTransaction) {
        this.db.exec('COMMIT');
        this.inTransaction = false;
      }
    }
    async rollback() {
      if (this.inTransaction) {
        this.db.exec('ROLLBACK');
        this.inTransaction = false;
      }
    }
    async release() {
      if (this.inTransaction) {
        await this.rollback();
      }
    }
  }

  function executeQuery(db, sql, params = []) {
    try {
      const trimmedSql = sql.trim().toLowerCase();
      if (trimmedSql.startsWith('insert')) {
        const stmt = db.prepare(sql);
        const result = stmt.run(...params);
        return [{ insertId: Number(result.lastInsertRowid), affectedRows: result.changes }, null];
      } else if (trimmedSql.startsWith('update')) {
        const stmt = db.prepare(sql);
        const result = stmt.run(...params);
        return [{ affectedRows: result.changes }, null];
      } else if (trimmedSql.startsWith('delete')) {
        const stmt = db.prepare(sql);
        const result = stmt.run(...params);
        return [{ affectedRows: result.changes }, null];
      } else {
        const stmt = db.prepare(sql);
        const rows = stmt.all(...params);
        return [rows, null];
      }
    } catch (error) {
      console.error('SQLite Query Error:', error.message);
      throw error;
    }
  }

  pool = {
    async execute(sql, params = []) {
      return executeQuery(sqliteDb, sql, params);
    },
    async getConnection() {
      return new SQLiteConnection(sqliteDb);
    },
    async end() {
      sqliteDb.close();
    }
  };

  console.log('✅ Database: SQLite connected (dev mode)');
}

module.exports = pool;
