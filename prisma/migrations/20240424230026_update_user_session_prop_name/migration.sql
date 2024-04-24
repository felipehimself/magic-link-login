/*
  Warnings:

  - You are about to drop the column `access_token` on the `UserSession` table. All the data in the column will be lost.
  - Added the required column `refresh_token` to the `UserSession` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_UserSession" (
    "userId" TEXT NOT NULL,
    "refresh_token" TEXT NOT NULL,
    CONSTRAINT "UserSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_UserSession" ("userId") SELECT "userId" FROM "UserSession";
DROP TABLE "UserSession";
ALTER TABLE "new_UserSession" RENAME TO "UserSession";
CREATE UNIQUE INDEX "UserSession_userId_key" ON "UserSession"("userId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
