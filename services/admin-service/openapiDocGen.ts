import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    title: 'Admin Service API',
    description: 'API for granting/revoking administrative roles on app users',
  },
  host: 'localhost:4000',
  schemes: ['http'],
};

const outputFile = './openapiDoc.json';
const endpointsFiles = ['./app.ts'];

/* NOTE: if you use the express Router, you must pass in the
   'endpointsFiles' only the root file where the route starts,
   such as index.js, app.js, routes.js, ... */

swaggerAutogen({openapi: '3.1.0'})(outputFile, endpointsFiles, doc);