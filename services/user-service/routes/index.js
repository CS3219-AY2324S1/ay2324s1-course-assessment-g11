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

const routes = function(userDatabaseClient) {
	let operations = {
		POST
	};

	function POST(req, res, next) {
		userDatabaseClient.createUser(req.body).then(
			(result) => {
				if (result === null) {
					res.status(400).end();
				} else {
					res.status(201).json(result);
				}
			}
		).catch((error) => {
			console.log(error);
			res.status(500).end();
		});
	}

	POST.apiDoc = {
		summary: 'Creates a new entry for user',
		operationId: 'createUserEntry',
		requestBody: {
			content: {
				"application/json": {
					schema: {
						allOf: [
							{
								$ref: "#/components/schemas/User",
							},
							{
								type: "object",
								properties: {
									uid: {
										description: "The GitHub uid of the user",
										type: "string"
									}
								}
							}
						],
						required: ['uid']
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
			400: {
				description: "Attempted to create user with uid that is already in the database",
			},
			500: {
				description: "Server encountered an error",
			},
		},
	};

	return operations;
}

module.exports = routes;