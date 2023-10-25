import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    title: "Matching Service",
    description: "",
  },
  host: "localhost:5002",
  schemes: ["http"],
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["./src/app.ts"];

/* NOTE: if you use the express Router, you must pass in the 
   'endpointsFiles' only the root file where the route starts,
   such as index.js, app.js, routes.js, ... */

swaggerAutogen({ openapi: "3.0.0" })(outputFile, endpointsFiles, doc);
/*.then(
    async () => {
      await import("./src/app"); // Your project's root file
    }
  );*/ // to run it after swagger-autogen
