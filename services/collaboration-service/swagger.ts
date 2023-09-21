import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    title: "Collaboration Service",
    description:
      "Provides the mechanism for real-time collaboration (e.g., concurrent code editing) between the authenticated and matched users in the collaborative space",
  },
  host: "localhost:5001",
  schemes: ["http"],
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["./src/app.ts"];

/* NOTE: if you use the express Router, you must pass in the 
   'endpointsFiles' only the root file where the route starts,
   such as index.js, app.js, routes.js, ... */

swaggerAutogen({ openapi: "3.0.0" })(outputFile, endpointsFiles, doc).then(
  async () => {
    await import("./src/app"); // Your project's root file
  }
);
