-- CreateTable
CREATE TABLE "ThesisTopic" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "datasetName" TEXT NOT NULL,
    "datasetUrl" TEXT NOT NULL,
    "datasetSize" TEXT NOT NULL,
    "isLocked" BOOLEAN NOT NULL DEFAULT false,
    "lockedAt" DATETIME,
    "lockedByUserId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ThesisTopic_lockedByUserId_fkey" FOREIGN KEY ("lockedByUserId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ThesisProject" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "topicId" INTEGER NOT NULL,
    "repoUrl" TEXT,
    "deployUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ThesisProject_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ThesisProject_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "ThesisTopic" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "ThesisTopic_isLocked_idx" ON "ThesisTopic"("isLocked");

-- CreateIndex
CREATE INDEX "ThesisTopic_lockedByUserId_idx" ON "ThesisTopic"("lockedByUserId");

-- CreateIndex
CREATE INDEX "ThesisTopic_category_idx" ON "ThesisTopic"("category");

-- CreateIndex
CREATE UNIQUE INDEX "ThesisProject_userId_key" ON "ThesisProject"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ThesisProject_topicId_key" ON "ThesisProject"("topicId");

-- CreateIndex
CREATE INDEX "ThesisProject_userId_idx" ON "ThesisProject"("userId");
