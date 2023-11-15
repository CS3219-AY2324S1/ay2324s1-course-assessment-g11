-- CreateTable
CREATE TABLE "WaitingUser" (
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "progLang" TEXT NOT NULL,
    "difficulty" TEXT[],
    "socketId" TEXT NOT NULL,

    CONSTRAINT "WaitingUser_pkey" PRIMARY KEY ("userId")
);

-- AddForeignKey
ALTER TABLE "WaitingUser" ADD CONSTRAINT "WaitingUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "AppUser"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;
