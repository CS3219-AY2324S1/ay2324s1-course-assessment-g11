/*
  Warnings:

  - You are about to drop the `AppUsers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "AppUsers";

-- CreateTable
CREATE TABLE "AppUser" (
    "uid" TEXT NOT NULL,
    "displayName" TEXT,
    "photoUrl" TEXT,
    "matchDifficulty" INTEGER,
    "matchProgrammingLanguage" TEXT,

    CONSTRAINT "AppUser_pkey" PRIMARY KEY ("uid")
);
