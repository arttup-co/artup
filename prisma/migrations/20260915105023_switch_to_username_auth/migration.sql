/*
  Migration: Switch from email-based to username-based authentication

  Changes:
  - Add `username` field as required unique field (primary auth identifier)
  - Make `email` field optional (for contact/profile purposes)
  - Migrate existing users: copy email to username field for backward compatibility
*/

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;

CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "username" TEXT NOT NULL,
    "email" TEXT,
    "password" TEXT NOT NULL,
    "emailVerified" DATETIME,
    "title" TEXT,
    "bio" TEXT,
    "avatarUrl" TEXT,
    "image" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Migrate existing data: use email as username for existing users
INSERT INTO "new_User" ("avatarUrl", "bio", "createdAt", "email", "emailVerified", "id", "image", "name", "password", "title", "username")
SELECT "avatarUrl", "bio", "createdAt", "email", "emailVerified", "id", "image", "name", "password", "title", "email" as "username"
FROM "User";

DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
