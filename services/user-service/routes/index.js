var db = require("../db/index.js");

var express = require("express");
var router = express.Router();

router.get("/", async (req, res, next) => {
  // const result = await db.query("SELECT * FROM users.users;");
  // res.json(result);
  return res.send("user-service");
});

module.exports = router;
