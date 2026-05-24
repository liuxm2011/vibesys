// backend/src/scripts/import-thesis-topics.ts
// Reads the thesis dataset JSON and outputs SQL INSERT statements to stdout
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { resolve } from 'path';

// Resolve relative to THIS script file, not cwd — tsx-compatible
const jsonPath = fileURLToPath(new URL('../../../毕业设计数据集信息.json', import.meta.url));
const topics = JSON.parse(readFileSync(jsonPath, 'utf-8')) as Array<{
  分类: string;
  数据集名: string;
  毕业设计名: string;
  数据集存储地址: string;
  数据集大小: string;
}>;

const escape = (s: string) => s.replace(/'/g, "''");

const deleteStmt = `DELETE FROM "ThesisTopic" WHERE "isLocked"=0 AND "lockedByUserId" IS NULL;`;

const inserts = topics.map(t =>
  `INSERT INTO "ThesisTopic" ("title","category","datasetName","datasetUrl","datasetSize","isLocked","createdAt") VALUES ('${escape(t['毕业设计名'])}','${escape(t['分类'])}','${escape(t['数据集名'])}','${escape(t['数据集存储地址'])}','${escape(t['数据集大小'])}',0,CURRENT_TIMESTAMP);`
);

process.stdout.write(deleteStmt + '\n' + inserts.join('\n') + '\n');
