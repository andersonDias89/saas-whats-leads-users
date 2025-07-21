/*
  Warnings:

  - You are about to drop the column `value` on the `Lead` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Lead" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "conversationId" TEXT,
    "name" TEXT,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "status" TEXT NOT NULL DEFAULT 'novo',
    "source" TEXT NOT NULL DEFAULT 'whatsapp',
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Lead_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Lead_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Lead" ("conversationId", "createdAt", "email", "id", "name", "notes", "phone", "source", "status", "updatedAt", "userId") SELECT "conversationId", "createdAt", "email", "id", "name", "notes", "phone", "source", "status", "updatedAt", "userId" FROM "Lead";
DROP TABLE "Lead";
ALTER TABLE "new_Lead" RENAME TO "Lead";
CREATE INDEX "Lead_userId_idx" ON "Lead"("userId");
CREATE INDEX "Lead_status_idx" ON "Lead"("status");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
