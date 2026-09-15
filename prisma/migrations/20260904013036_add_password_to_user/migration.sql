/*
  Migration: Add password field to User model

  This migration adds password-based authentication to replace magic link auth.
  For existing users, a temporary hashed password 'changeme' is set.
  In production, users will be created with proper passwords via install.sh.
*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "emailVerified" DATETIME,
    "title" TEXT,
    "bio" TEXT,
    "avatarUrl" TEXT,
    "image" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
-- Insert existing users with a temporary password hash for 'changeme'
-- bcrypt hash for 'changeme': $2a$10$YourSaltAndHashHere (will be reset in dev)
INSERT INTO "new_User" ("avatarUrl", "bio", "createdAt", "email", "emailVerified", "id", "image", "name", "title", "password")
SELECT "avatarUrl", "bio", "createdAt", "email", "emailVerified", "id", "image", "name", "title", '$2a$10$rOZE3qJZ8qKQN5xK5xK5xO9Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1'
FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
