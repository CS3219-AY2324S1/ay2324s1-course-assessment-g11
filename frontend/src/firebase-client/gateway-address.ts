/**
 * File for defining the address of the gateway server.
 *
 * How to use:
 *   - For development environment, use localhost
 *   - For production environment, use DNS
 */
const gatewayAddress = (process.env.NODE_ENV === "development")
  ? "http://localhost:4000/"
  : "http://gateway:4000/";

export const userApiPathAddress = gatewayAddress + "api/user-service/"
