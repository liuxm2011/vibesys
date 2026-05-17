/**
 * MySQL → Cloudflare D1 migration script
 * Usage: MYSQL_HOST=... MYSQL_USER=... MYSQL_PASSWORD=... MYSQL_DATABASE=... tsx src/scripts/mysql-to-d1.ts
 * Output: prisma/d1-import.sql  (run with: wrangler d1 execute vibesysdb --file=./prisma/d1-import.sql --remote)
 */

import mysql from 'mysql2/promise';
import { writeFileSync } from 'fs';
import { join } from 'path';

const MYSQL_CONFIG = {
  host: process.env.MYSQL_HOST || 'localhost',
  port: parseInt(process.env.MYSQL_PORT || '3306'),
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'vibesys',
};

// Tables in dependency order (foreign key safe)
const TABLES = [
  'User',
  'Topic',
  'Project',
  'Document',
  'GraduationDocument',
  'SystemConfig',
  'UserApiSetting',
  'ApiProvider',
  'AiUsageLog',
];

function escapeValue(val: unknown): string {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'number') return String(val);
  if (typeof val === 'boolean') return val ? '1' : '0';

  // MySQL2 returns Date objects for DATETIME columns
  if (val instanceof Date) {
    return `'${val.toISOString()}'`;
  }

  // JSON columns returned as objects by mysql2
  if (typeof val === 'object') {
    const json = JSON.stringify(val).replace(/'/g, "''");
    return `'${json}'`;
  }

  // String: escape single quotes
  const str = String(val).replace(/'/g, "''");
  return `'${str}'`;
}

async function exportTable(conn: mysql.Connection, table: string): Promise<string[]> {
  const [rows] = await conn.query(`SELECT * FROM \`${table}\``) as [Record<string, unknown>[], unknown];

  if (!Array.isArray(rows) || rows.length === 0) {
    console.log(`  ${table}: 0 rows (skipped)`);
    return [];
  }

  const statements: string[] = [];

  for (const row of rows) {
    const cols = Object.keys(row).map(c => `"${c}"`).join(', ');
    const vals = Object.values(row).map(escapeValue).join(', ');
    statements.push(`INSERT OR IGNORE INTO "${table}" (${cols}) VALUES (${vals});`);
  }

  console.log(`  ${table}: ${rows.length} rows`);
  return statements;
}

async function main() {
  console.log('Connecting to MySQL:', `${MYSQL_CONFIG.user}@${MYSQL_CONFIG.host}:${MYSQL_CONFIG.port}/${MYSQL_CONFIG.database}`);

  const conn = await mysql.createConnection(MYSQL_CONFIG);

  const allStatements: string[] = [
    '-- D1 import generated from MySQL migration',
    `-- Generated: ${new Date().toISOString()}`,
    '',
    'PRAGMA foreign_keys = OFF;',
    '',
  ];

  for (const table of TABLES) {
    try {
      const stmts = await exportTable(conn, table);
      if (stmts.length > 0) {
        allStatements.push(`-- Table: ${table}`);
        allStatements.push(...stmts);
        allStatements.push('');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn(`  ${table}: skipped (${msg})`);
    }
  }

  allStatements.push('PRAGMA foreign_keys = ON;');

  await conn.end();

  const outputPath = join(process.cwd(), 'prisma', 'd1-import.sql');
  writeFileSync(outputPath, allStatements.join('\n'), 'utf-8');
  console.log(`\nOutput: ${outputPath}`);
  console.log('Next step: wrangler d1 execute vibesysdb --file=./prisma/d1-import.sql --remote');
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
