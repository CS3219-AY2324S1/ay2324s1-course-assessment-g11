-- CreateEnum
CREATE TYPE "EnumRoomStatus" AS ENUM ('active', 'inactive');

-- CreateTable
CREATE TABLE "Room" (
    "room_id" TEXT NOT NULL,
    "users" TEXT[],
    "status" "EnumRoomStatus" NOT NULL,
    "text" TEXT NOT NULL,
    "saved_text" TEXT,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("room_id")
);
