-- Create missing tables in D1 (safe: IF NOT EXISTS)
-- Run: wrangler d1 execute vibesysdb --file=./prisma/d1-missing-tables.sql --remote

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS "Topic" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "background" TEXT,
    "objectives" TEXT,
    "domain" TEXT NOT NULL,
    "platform" TEXT NOT NULL DEFAULT 'WEB',
    "techStack" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'SYSTEM',
    "creatorId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Topic_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "Project" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "topicId" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'NOT_STARTED',
    "techStack" TEXT,
    "documentsRef" TEXT,
    "reviewStatus" TEXT NOT NULL DEFAULT 'NONE',
    "reviewResult" TEXT,
    "repoUrl" TEXT,
    "repoSyncData" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Project_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Project_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "Document" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "projectId" INTEGER NOT NULL,
    "docType" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Document_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "GraduationDocument" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "projectId" INTEGER NOT NULL,
    "docType" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "GraduationDocument_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "UserApiSetting" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "baseURL" TEXT NOT NULL,
    "apiKey" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

CREATE TABLE IF NOT EXISTS "ApiProvider" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "providerType" TEXT NOT NULL,
    "baseURL" TEXT NOT NULL,
    "apiKey" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "isActive" INTEGER NOT NULL DEFAULT 0,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

CREATE TABLE IF NOT EXISTS "AiUsageLog" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "projectId" INTEGER,
    "docType" TEXT,
    "operation" TEXT NOT NULL,
    "promptTokens" INTEGER NOT NULL DEFAULT 0,
    "completionTokens" INTEGER NOT NULL DEFAULT 0,
    "totalTokens" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'success',
    "errorMessage" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes (IF NOT EXISTS not needed for indexes — they'll error silently on dup, use CREATE INDEX IF NOT EXISTS)
CREATE INDEX IF NOT EXISTS "Topic_domain_idx" ON "Topic"("domain");
CREATE INDEX IF NOT EXISTS "Topic_type_idx" ON "Topic"("type");
CREATE INDEX IF NOT EXISTS "Topic_creatorId_idx" ON "Topic"("creatorId");

CREATE INDEX IF NOT EXISTS "Project_userId_idx" ON "Project"("userId");
CREATE INDEX IF NOT EXISTS "Project_status_idx" ON "Project"("status");
CREATE INDEX IF NOT EXISTS "Project_topicId_idx" ON "Project"("topicId");

CREATE INDEX IF NOT EXISTS "Document_projectId_idx" ON "Document"("projectId");
CREATE UNIQUE INDEX IF NOT EXISTS "Document_projectId_docType_key" ON "Document"("projectId", "docType");

CREATE INDEX IF NOT EXISTS "GraduationDocument_projectId_idx" ON "GraduationDocument"("projectId");
CREATE UNIQUE INDEX IF NOT EXISTS "GraduationDocument_projectId_docType_key" ON "GraduationDocument"("projectId", "docType");

CREATE UNIQUE INDEX IF NOT EXISTS "UserApiSetting_userId_key" ON "UserApiSetting"("userId");
CREATE INDEX IF NOT EXISTS "UserApiSetting_userId_idx" ON "UserApiSetting"("userId");

CREATE INDEX IF NOT EXISTS "ApiProvider_isActive_idx" ON "ApiProvider"("isActive");
CREATE INDEX IF NOT EXISTS "ApiProvider_orderIndex_idx" ON "ApiProvider"("orderIndex");

CREATE INDEX IF NOT EXISTS "AiUsageLog_userId_idx" ON "AiUsageLog"("userId");
CREATE INDEX IF NOT EXISTS "AiUsageLog_createdAt_idx" ON "AiUsageLog"("createdAt");
CREATE INDEX IF NOT EXISTS "AiUsageLog_operation_idx" ON "AiUsageLog"("operation");
