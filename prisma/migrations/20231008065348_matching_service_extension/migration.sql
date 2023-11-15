-- CreateTable
CREATE TABLE "Match" (
    "roomId" TEXT NOT NULL,
    "userId1" TEXT NOT NULL,
    "userId2" TEXT NOT NULL,
    "chosenDifficulty" TEXT NOT NULL,
    "chosenProgrammingLanguage" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("roomId")
);
