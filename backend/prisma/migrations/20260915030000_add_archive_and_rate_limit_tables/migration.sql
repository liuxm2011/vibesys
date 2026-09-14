-- Baseline 迁移：补齐 schema 与迁移链之间的漂移（审查报告 P1-1 + P0-2）
--
-- 生产 D1 由 CI 的 `prisma db push --skip-generate` 按 schema 全量同步建立，
-- 已包含以下全部对象；本迁移仅为 `prisma migrate deploy` 路径补齐，
-- 使按迁移链重建的环境（新协作者/新环境）不缺表缺列。
--
-- 漂移内容（npx prisma migrate diff 核实）：
--   1. ArchivedGrade / ArchivedThesisProject 两表及索引（归档模块，无迁移文件）
--   2. RateLimitEntry 表（D1 限流，本次新增）
--   3. User.passwordIsDefault 列 + User_studentId_idx / User_role_idx 索引
--      （init 迁移中缺失，schema 中存在）
-- 全部为 CREATE/ALTER 增量语句，对已 db push 的库执行会因对象已存在而冲突，
-- 生产 D1 不执行本迁移（生产 RateLimitEntry 建表走手动 wrangler d1 execute）。

-- CreateTable
CREATE TABLE "ArchivedGrade" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "grade" TEXT NOT NULL,
    "archivedByUserId" INTEGER,
    "studentCount" INTEGER NOT NULL DEFAULT 0,
    "projectCount" INTEGER NOT NULL DEFAULT 0,
    "thesisCount" INTEGER NOT NULL DEFAULT 0,
    "archivedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "ArchivedThesisProject" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "grade" TEXT NOT NULL,
    "originalThesisProjectId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "studentId" TEXT NOT NULL,
    "studentName" TEXT NOT NULL,
    "className" TEXT NOT NULL,
    "topicId" INTEGER NOT NULL,
    "topicTitle" TEXT NOT NULL,
    "topicCategory" TEXT NOT NULL,
    "datasetName" TEXT NOT NULL,
    "linkedProjectId" INTEGER,
    "repoUrl" TEXT,
    "deployUrl" TEXT,
    "originalCreatedAt" DATETIME NOT NULL,
    "archivedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "RateLimitEntry" (
    "key" TEXT NOT NULL PRIMARY KEY,
    "count" INTEGER NOT NULL DEFAULT 0,
    "resetAt" DATETIME NOT NULL
);

-- AlterTable (init 迁移缺失此列，schema 中存在)
ALTER TABLE "User" ADD COLUMN "passwordIsDefault" BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE UNIQUE INDEX "ArchivedGrade_grade_key" ON "ArchivedGrade"("grade");

-- CreateIndex
CREATE INDEX "ArchivedGrade_grade_idx" ON "ArchivedGrade"("grade");

-- CreateIndex
CREATE INDEX "ArchivedThesisProject_grade_idx" ON "ArchivedThesisProject"("grade");

-- CreateIndex
CREATE INDEX "ArchivedThesisProject_userId_idx" ON "ArchivedThesisProject"("userId");