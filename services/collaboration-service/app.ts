// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'express'.
const express = require("express");
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const http = require("http");
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const { Server } = require("socket.io");
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const swaggerUi = require("swagger-ui-express");
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const swaggerFile = require("./swagger-output.json");
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const bodyParser = require("body-parser");

const app = express();
const server = http.createServer(app);
// @ts-expect-error TS(2304): Cannot find name 'io'.
io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
const PORT = process.env.PORT || 5001;

/* Routers */
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
app.use("/test", require("./routes/index"));
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
app.use("/session", require("./routes/session"));

/* Middlewares */
app.use(bodyParser.json()); // what this?
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

server.listen(PORT, () => {
  console.log("listening on *:5001");
});
