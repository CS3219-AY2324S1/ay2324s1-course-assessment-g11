import { PrismaClient, Room } from "@prisma/client";

const prisma = new PrismaClient();

export async function isRoomExists(room_id: string) {
  const room = await prisma.room.findFirst({
    where: {
      room_id: room_id,
    },
  });
  return room != null;
}

export async function getRoom(room_id: string): Promise<Room> {
  const room = await prisma.room.findUnique({
    where: {
      room_id: room_id,
    },
  });
  return room!;
}

export async function getRoomText(room_id: string): Promise<string> {
  const room = await prisma.room.findUnique({
    where: {
      room_id: room_id,
    },
  });
  if (room) {
    return room.text;
  } else {
    return "";
  }
}

export async function getSavedRoomText(
  room_id: string
): Promise<string | null> {
  const room = await prisma.room.findUnique({
    where: {
      room_id: room_id,
    },
  });
  if (room) {
    return room.saved_text;
  } else {
    return null;
  }
}

export async function updateRoomStatus(room_id: string): Promise<void> {
  const room = await prisma.room.findUnique({
    where: {
      room_id: room_id,
    },
  });
  if (!room) return;

  if (room.users.length === 0) {
    room.status = "inactive";
  } else {
    room.status = "active";
  }
}

export async function createOrUpdateRoomWithUser(
  room_id: string,
  user_id: string
): Promise<void> {
  await prisma.room.upsert({
    where: {
      room_id: room_id,
    },
    update: {
      status: "active",
      users: {
        push: user_id,
      },
    },
    create: {
      room_id: room_id,
      text: "",
      status: "active",
      users: [user_id],
    },
  });
}

export async function updateRoomText(
  room_id: string,
  text: string
): Promise<void> {
  await prisma.room.update({
    where: {
      room_id: room_id,
    },
    data: {
      text: text,
    },
  });
}

export async function saveRoomText(
  room_id: string,
  text: string
): Promise<void> {
  await prisma.room.update({
    where: {
      room_id: room_id,
    },
    data: {
      text: text,
      saved_text: text,
    },
  });
}

export async function removeUserFromRoom(
  room_id: string,
  user_id: string
): Promise<void> {
  const existingRoom = await prisma.room.findUnique({
    where: {
      room_id: room_id,
    },
  });

  if (!existingRoom) return;

  const userIndex = existingRoom.users.indexOf(user_id);

  if (userIndex > -1) {
    existingRoom.users.splice(userIndex, 1);

    await prisma.room.update({
      where: {
        room_id: room_id,
      },
      data: {
        users: {
          set: existingRoom.users,
        },
      },
    });
  }
}
