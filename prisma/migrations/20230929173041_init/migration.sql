-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "isLookingForMatch" BOOLEAN NOT NULL,
    "matchedUserId" INTEGER,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_matchedUserId_key" ON "User"("matchedUserId");
