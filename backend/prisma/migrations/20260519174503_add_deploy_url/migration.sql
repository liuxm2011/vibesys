-- CreateTable
CREATE TABLE "GraduationDocument" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "projectId" INTEGER NOT NULL,
    "docType" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "GraduationDocument_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserApiSetting" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "baseURL" TEXT NOT NULL,
    "apiKey" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ApiProvider" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "providerType" TEXT NOT NULL,
    "baseURL" TEXT NOT NULL,
    "apiKey" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "AiUsageLog" (
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

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Project" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "topicId" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'NOT_STARTED',
    "techStack" TEXT,
    "documentsRef" JSONB,
    "reviewStatus" TEXT NOT NULL DEFAULT 'NONE',
    "reviewResult" JSONB,
    "repoUrl" TEXT,
    "repoSyncData" JSONB,
    "deployUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Project_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Project_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Project" ("createdAt", "documentsRef", "id", "status", "techStack", "topicId", "updatedAt", "userId") SELECT "createdAt", "documentsRef", "id", "status", "techStack", "topicId", "updatedAt", "userId" FROM "Project";
DROP TABLE "Project";
ALTER TABLE "new_Project" RENAME TO "Project";
CREATE INDEX "Project_userId_idx" ON "Project"("userId");
CREATE INDEX "Project_status_idx" ON "Project"("status");
CREATE INDEX "Project_topicId_idx" ON "Project"("topicId");
CREATE TABLE "new_Topic" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "background" TEXT,
    "objectives" TEXT,
    "domain" TEXT NOT NULL,
    "platform" TEXT NOT NULL DEFAULT 'WEB',
    "techStack" JSONB NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'SYSTEM',
    "creatorId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Topic_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Topic" ("background", "createdAt", "creatorId", "description", "domain", "id", "objectives", "techStack", "title", "type", "updatedAt") SELECT "background", "createdAt", "creatorId", "description", "domain", "id", "objectives", "techStack", "title", "type", "updatedAt" FROM "Topic";
DROP TABLE "Topic";
ALTER TABLE "new_Topic" RENAME TO "Topic";
CREATE INDEX "Topic_domain_idx" ON "Topic"("domain");
CREATE INDEX "Topic_type_idx" ON "Topic"("type");
CREATE INDEX "Topic_creatorId_idx" ON "Topic"("creatorId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "GraduationDocument_projectId_idx" ON "GraduationDocument"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "GraduationDocument_projectId_docType_key" ON "GraduationDocument"("projectId", "docType");

-- CreateIndex
CREATE UNIQUE INDEX "UserApiSetting_userId_key" ON "UserApiSetting"("userId");

-- CreateIndex
CREATE INDEX "UserApiSetting_userId_idx" ON "UserApiSetting"("userId");

-- CreateIndex
CREATE INDEX "ApiProvider_isActive_idx" ON "ApiProvider"("isActive");

-- CreateIndex
CREATE INDEX "ApiProvider_orderIndex_idx" ON "ApiProvider"("orderIndex");

-- CreateIndex
CREATE INDEX "AiUsageLog_userId_idx" ON "AiUsageLog"("userId");

-- CreateIndex
CREATE INDEX "AiUsageLog_createdAt_idx" ON "AiUsageLog"("createdAt");

-- CreateIndex
CREATE INDEX "AiUsageLog_operation_idx" ON "AiUsageLog"("operation");
