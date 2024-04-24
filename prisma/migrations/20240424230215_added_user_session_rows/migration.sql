/*
  Warnings:

  - Added the required column `update_at` to the `UserSession` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_UserSession" (
    "userId" TEXT NOT NULL,
    "refresh_token" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" DATETIME NOT NULL,
    CONSTRAINT "UserSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_UserSession" ("refresh_token", "userId") SELECT "refresh_token", "userId" FROM "UserSession";
DROP TABLE "UserSession";
ALTER TABLE "new_UserSession" RENAME TO "UserSession";
CREATE UNIQUE INDEX "UserSession_userId_key" ON "UserSession"("userId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
