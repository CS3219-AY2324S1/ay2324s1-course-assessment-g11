// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

type Data = {
	name: string;
};

export default function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	const users = prisma.user.findMany();
	console.log(JSON.stringify(users));
	res.status(200).json({ name: "John Doe" });
}
