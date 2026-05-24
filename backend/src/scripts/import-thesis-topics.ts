// backend/src/scripts/import-thesis-topics.ts
// Reads the thesis dataset JSON and outputs SQL INSERT statements to stdout
import { readFileSync } from 'fs';
import { resolve } from 'path';

// JSON file is at repo root, one level above /backend
// Use process.cwd() as fallback if import.meta.dirname is unavailable
let jsonPath: string;
try {
  // @ts-ignore — import.meta.dirname is available in Node 21+ / tsx
  jsonPath = resolve(import.meta.dirname, '../../../../毕业设计数据集信息.json');
  readFileSync(jsonPath); // verify it exists
} catch {
  // fallback: assume script is run from /backend or repo root
  const cwd = process.cwd();
  // Try repo root (one level up from backend)
  jsonPath = resolve(cwd, '../毕业设计数据集信息.json');
  try {
    readFileSync(jsonPath);
  } catch {
    // Try cwd directly (if already at repo root)
    jsonPath = resolve(cwd, '毕业设计数据集信息.json');
  }
}

const topics = JSON.parse(readFileSync(jsonPath, 'utf-8')) as Array<{
  分类: string;
  数据集名: string;
  毕业设计名: string;
  数据集存储地址: string;
  数据集大小: string;
}>;

const escape = (s: string) => s.replace(/'/g, "''");

const inserts = topics.map(t =>
  `INSERT OR IGNORE INTO "ThesisTopic" ("title","category","datasetName","datasetUrl","datasetSize","isLocked","createdAt") VALUES ('${escape(t['毕业设计名'])}','${escape(t['分类'])}','${escape(t['数据集名'])}','${escape(t['数据集存储地址'])}','${escape(t['数据集大小'])}',0,CURRENT_TIMESTAMP);`
);

process.stdout.write(inserts.join('\n') + '\n');
