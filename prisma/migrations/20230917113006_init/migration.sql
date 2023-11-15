-- CreateTable
CREATE TABLE "User" (
    "uid" TEXT NOT NULL,
    "displayName" TEXT,
    "photoUrl" TEXT,
    "matchDifficulty" INTEGER,
    "matchProgrammingLanguage" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("uid")
);
