-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ThesisProject" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "topicId" INTEGER NOT NULL,
    "projectId" INTEGER,
    "repoUrl" TEXT,
    "deployUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ThesisProject_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ThesisProject_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "ThesisTopic" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ThesisProject_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_ThesisProject" ("createdAt", "deployUrl", "id", "repoUrl", "topicId", "updatedAt", "userId") SELECT "createdAt", "deployUrl", "id", "repoUrl", "topicId", "updatedAt", "userId" FROM "ThesisProject";
DROP TABLE "ThesisProject";
ALTER TABLE "new_ThesisProject" RENAME TO "ThesisProject";
CREATE UNIQUE INDEX "ThesisProject_userId_key" ON "ThesisProject"("userId");
CREATE UNIQUE INDEX "ThesisProject_topicId_key" ON "ThesisProject"("topicId");
CREATE UNIQUE INDEX "ThesisProject_projectId_key" ON "ThesisProject"("projectId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
