import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    title: "User Service API",
    description: "API for storing custom user data",
  },
  host: "localhost:5001",
  schemes: ["http"],
};

const outputFile = "./src/swagger-output.json";
const endpointsFiles = ["./src/app.ts"];

/* NOTE: if you use the express Router, you must pass in the
   'endpointsFiles' only the root file where the route starts,
   such as index.ts, app.ts, routes.js, ... */

swaggerAutogen({ openapi: "3.0.0" })(outputFile, endpointsFiles, doc);
