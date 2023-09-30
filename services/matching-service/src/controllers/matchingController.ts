import { Request, Response } from "express";
import { Server } from "socket.io";
import prisma from "../prismaClient";

export const findMatch = async (req: Request, res: Response) => {
  const io: Server = req.app.get("io");

  const userId = parseInt(req.params.userId);
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  // Check if the user is already matched with another user
  if (user.matchedUserId) {
    const matchedUser = await prisma.user.findUnique({
      where: { id: user.matchedUserId },
    });

    if (matchedUser) {
      // Check for timeout or if the matched user has left
      const now = new Date();
      const sixtySecondsAgo = new Date(now.getTime() - 60 * 1000);

      if (
        !user.lastConnected ||
        user.lastConnected < sixtySecondsAgo ||
        !matchedUser.matchedUserId
      ) {
        // Break the match and update both users' status
        await prisma.user.update({
          where: { id: userId },
          data: { matchedUserId: null, lastConnected: null },
        });

        if (matchedUser.matchedUserId) {
          await prisma.user.update({
            where: { id: matchedUser.id },
            data: { matchedUserId: null, lastConnected: null },
          });
        }
      } else {
        // Update the lastConnected timestamp and reconnect the users
        const now = new Date();
        await prisma.user.update({
          where: { id: userId },
          data: {
            lastConnected: now,
          },
        });

        await prisma.user.update({
          where: { id: matchedUser.id },
          data: {
            lastConnected: now,
          },
        });

        // Emit match found event to both users
        io.to(userId.toString()).emit("matchFound", matchedUser);
        io.to(matchedUser.id.toString()).emit("matchFound", user);
        return res.json({ match: matchedUser });
      }
    }
  }

  if (user.isLookingForMatch) {
    return res
      .status(400)
      .json({ error: "User is already looking for a match" });
  }

  // Update user status to looking for a match
  await prisma.user.update({
    where: { id: userId },
    data: { isLookingForMatch: true },
  });

  // Try to find a match
  const match = await prisma.user.findFirst({
    where: { isLookingForMatch: true, id: { not: userId } },
  });

  if (match) {
    // Both users are matched
    await prisma.user.update({
      where: { id: userId },
      data: {
        isLookingForMatch: false,
        matchedUserId: match.id,
        lastConnected: new Date(),
      },
    });

    await prisma.user.update({
      where: { id: match.id },
      data: {
        isLookingForMatch: false,
        matchedUserId: userId,
        lastConnected: new Date(),
      },
    });

    // Emit match found event to both users
    io.to(userId.toString()).emit("matchFound", match);
    io.to(match.id.toString()).emit("matchFound", user);

    return res.json({ match });
  }

  // If no immediate match is found, keep the user in the queue
  return res.status(202).json({ message: "Looking for a match, please wait." });
};

export const leaveMatch = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.userId);
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  if (!user.matchedUserId) {
    return res.status(400).json({ error: "User is not in a match" });
  }

  // Update both users' status
  await prisma.user.update({
    where: { id: userId },
    data: { matchedUserId: null, lastConnected: null },
  });

  await prisma.user.update({
    where: { id: user.matchedUserId },
    data: { matchedUserId: null, lastConnected: null },
  });

  res.status(200).json({ message: "Successfully left the match" });
};
