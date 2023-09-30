/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "AppUsers" (
    "uid" TEXT NOT NULL,
    "displayName" TEXT,
    "photoUrl" TEXT,
    "matchDifficulty" INTEGER,
    "matchProgrammingLanguage" TEXT,

    CONSTRAINT "AppUsers_pkey" PRIMARY KEY ("uid")
);
