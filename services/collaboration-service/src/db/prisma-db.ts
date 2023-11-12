import { AppUser, PrismaClient, Room } from "@prisma/client";

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

  if (room.active_users.length === 0) {
    room.status = "inactive";
    saveAttempt(room_id);
  } else {
    room.status = "active";
  }
  await prisma.room.update({
    where: {
      room_id: room_id,
    },
    data: {
      status: room.status,
    },
  });
}

export async function saveAttempt(room_id: string): Promise<void> {
  const room = await prisma.room.findUnique({
    where: {
      room_id: room_id,
    },
  });

  const attempt_id = room!.attempt_id;
  const answer = room!.text;
  const question_id = room!.question_id ?? "";

  const users: AppUser[] = await prisma.appUser.findMany({
    where: {
      uid: {
        in: room!.users,
      },
    },
  });

  if (attempt_id) {
    await prisma.attempt.update({
      where: {
        id: attempt_id,
      },
      data: {
        users: {
          connect: users.map((user) => ({
            uid: user.uid as string,
          })),
        },
        answer: answer,
        time_saved_at: new Date(),
      },
    });
    return;
  }

  await prisma.attempt.create({
    data: {
      users: {
        connect: users.map((user) => ({
          uid: user.uid as string,
        })),
      },
      question_id: question_id,
      answer: answer,
      room_id: room_id,
      room: {
        connect: {
          room_id: room_id,
        },
      },
    },
  });
}

export async function setRoomQuestion(
  room_id: string,
  question_id: string
): Promise<void> {
  await prisma.room.update({
    where: {
      room_id: room_id,
    },
    data: {
      question_id: question_id,
    },
  });
}

export async function createOrUpdateRoomWithUser(
  room_id: string,
  user_id: string
): Promise<void> {
  let users: string[] = [];
  let active_users: string[] = [];
  const room = await prisma.room.findUnique({
    where: {
      room_id: room_id,
    },
    select: {
      users: true,
      active_users: true,
    },
  });
  if (room) {
    users = room.users;
    active_users = room.active_users;
    if (users.indexOf(user_id) === -1) {
      throw new Error("User is not authorized to be in the room");
    }
    if (active_users.indexOf(user_id) === -1) {
      active_users.push(user_id);
    }
  }

  await prisma.room.update({
    where: {
      room_id: room_id,
    },
    data: {
      status: "active",
      users: {
        set: users,
      },
      active_users: {
        set: active_users,
      },
    }
  });
}

export async function updateRoomText(
  room_id: string,
  text: string
): Promise<void> {
  if (room_id == null) return;
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

  const userIndex = existingRoom.active_users.indexOf(user_id);

  if (userIndex > -1) {
    existingRoom.active_users.splice(userIndex, 1);

    await prisma.room.update({
      where: {
        room_id: room_id,
      },
      data: {
        active_users: {
          set: existingRoom.active_users,
        },
      },
    });
  }
}
