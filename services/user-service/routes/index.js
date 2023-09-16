// var db = require("../db/index.js");
//
// var express = require("express");
// var router = express.Router();
//
// const { PrismaClient } = require("@prisma/client");
// const prisma = new PrismaClient();
//
// router.get("/", async (req, res, next) => {
// 	const result = await db.query("SELECT * FROM users.users;");
// 	res.json(result);
// });
//
// module.exports = router;

export default function(userDatabase) {
	let operations = {
		POST
	};

	function POST(req, res, next) {
		// TODO: Actually implement it
		// res.status(200).json(worldsService.getWorlds(req.query.worldName));
	}

	POST.apiDoc = {
		summary: 'Creates a new entry for user ',
		operationId: 'createUserEntry',
		requestBody: {
			content: {
				"application/json": {
					schema: {
						$ref: "#/components/schemas/User",
					},
				},
			},
		},
		responses: {
			201: {
				description: "Newly created user",
				content: {
					"application/json": {
						schema: {
							$ref: "#/components/schemas/User",
						},
					},
				},
			},
		},
	};

	return operations;
}
