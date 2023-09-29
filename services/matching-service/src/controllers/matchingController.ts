import { Request, Response } from "express";
import prisma from "../prismaClient";
import { Server } from "socket.io";

export const findMatch = async (req: Request, res: Response) => {
  const io: Server = req.app.get("io");

  const users = await prisma.user.findMany();
  console.log(users);

  const userId = parseInt(req.params.userId);
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
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
      data: { isLookingForMatch: false, matchedUserId: match.id },
    });

    await prisma.user.update({
      where: { id: match.id },
      data: { isLookingForMatch: false, matchedUserId: userId },
    });

    // Emit match found event to both users
    io.to(userId.toString()).emit("matchFound", match);
    io.to(match.id.toString()).emit("matchFound", user);

    return res.json({ match });
  }

  // If no immediate match is found, keep the user in the queue
  return res.status(202).json({ message: "Looking for a match, please wait." });
};
