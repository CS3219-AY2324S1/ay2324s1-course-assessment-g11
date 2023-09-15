var db = require("../db/index.js");

var express = require("express");
var router = express.Router();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.get("/", async (req, res, next) => {
	const result = await db.query("SELECT * FROM users.users;");
	res.json(result);
});

module.exports = router;
