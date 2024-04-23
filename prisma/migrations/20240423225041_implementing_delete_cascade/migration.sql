-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ConfirmAccount" (
    "userId" TEXT NOT NULL,
    "confirmed" BOOLEAN NOT NULL DEFAULT false,
    "code_confirmation" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" DATETIME NOT NULL,
    CONSTRAINT "ConfirmAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ConfirmAccount" ("code_confirmation", "confirmed", "created_at", "update_at", "userId") SELECT "code_confirmation", "confirmed", "created_at", "update_at", "userId" FROM "ConfirmAccount";
DROP TABLE "ConfirmAccount";
ALTER TABLE "new_ConfirmAccount" RENAME TO "ConfirmAccount";
CREATE UNIQUE INDEX "ConfirmAccount_userId_key" ON "ConfirmAccount"("userId");
CREATE UNIQUE INDEX "ConfirmAccount_code_confirmation_key" ON "ConfirmAccount"("code_confirmation");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
