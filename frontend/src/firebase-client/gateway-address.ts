/**
 * File for defining the address of the gateway server.
 *
 * How to use:
 *   - For localhost development, set ENVIRONMENT_TYPE environment variable to "local-dev"
 *   - For other environments like Docker or Kubernetes, use name resolution
 */
const gatewayAddress = (process.env.NODE_ENV === "development")
  ? "http://localhost:4000/"
  : "http://gateway:4000/";

export const userApiPathAddress = gatewayAddress + "api/user-service/";
export const questionApiPathAddress = gatewayAddress + "api/question-service/";
