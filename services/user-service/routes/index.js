const routes = function(userDatabaseClient) {
	let operations = {
		POST
	};

	function POST(req, res, next) {
		console.log(req);
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
		parameters: [
			{
				in: 'body',
				name: "userData",
				required: true,
				schema: {
					allOf: [
						{
							$ref: "#/definitions/User",
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
				}
			}
		],
		responses: {
			201: {
				description: "Newly created user",
				schema: {
					$ref: "#/definitions/User",
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

module.exports=routes;