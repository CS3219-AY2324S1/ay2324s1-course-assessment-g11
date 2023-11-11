/*
  Warnings:

  - A unique constraint covering the columns `[attempt_id]` on the table `Room` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "AppUser" ALTER COLUMN "matchDifficulty" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Match" ADD COLUMN     "questionId" TEXT;

-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "active_users" TEXT[],
ADD COLUMN     "attempt_id" TEXT,
ADD COLUMN     "question_id" TEXT;

-- CreateTable
CREATE TABLE "Attempt" (
    "id" TEXT NOT NULL,
    "question_id" TEXT NOT NULL,
    "answer" TEXT,
    "solved" BOOLEAN NOT NULL DEFAULT false,
    "time_saved_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "room_id" TEXT,
    "time_updated" TIMESTAMP(3) NOT NULL,
    "time_created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Attempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AppUserToAttempt" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_AppUserToAttempt_AB_unique" ON "_AppUserToAttempt"("A", "B");

-- CreateIndex
CREATE INDEX "_AppUserToAttempt_B_index" ON "_AppUserToAttempt"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Room_attempt_id_key" ON "Room"("attempt_id");

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_attempt_id_fkey" FOREIGN KEY ("attempt_id") REFERENCES "Attempt"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AppUserToAttempt" ADD CONSTRAINT "_AppUserToAttempt_A_fkey" FOREIGN KEY ("A") REFERENCES "AppUser"("uid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AppUserToAttempt" ADD CONSTRAINT "_AppUserToAttempt_B_fkey" FOREIGN KEY ("B") REFERENCES "Attempt"("id") ON DELETE CASCADE ON UPDATE CASCADE;
