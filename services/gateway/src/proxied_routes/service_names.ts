/**
 * File for defining the addresses of other services
 *
 * How to use:
 *   - For localhost development, set ENVIRONMENT_TYPE environment variable to "local-dev"
 *   - For other environments like Docker or Kubernetes, use name resolution
 */

const isLocal : boolean = (process.env.ENVIRONMENT_TYPE === "local-dev");

export const userServiceAddress : string = (isLocal)
  ? "http://localhost:5001/"
  : "http://user-service:5001/";

export const matchingServiceAddress : string = (isLocal)
  ? "http://localhost:5002/"
  : "http://matching-service:5002/";

export const collaborationServiceAddress : string = (isLocal)
  ? "http://localhost:5003/"
  : "http://collaboration-service:5003/";

export const questionServiceAddress : string = (isLocal)
  ? "http://localhost:5004/"
  : "http://question-service:5004/";

export const adminServiceAddress : string = (isLocal)
  ? "http://localhost:5005/"
  : "http://admin-service:5005/";

export const frontendAddress : string = (isLocal)
  ? "http://localhost:3000"
  : process.env.FRONTEND_ADDRESS as string;
// This is used in CORS origin checking, so the address cannot have a trailing forward slash
