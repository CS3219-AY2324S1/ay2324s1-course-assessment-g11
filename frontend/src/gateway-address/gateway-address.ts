/**
 * File for defining the address of the gateway server.
 *
 * How to use:
 *   - Leave NEXT_PUBLIC_GATEWAY_ADDRESS empty for dev environments
 *   - For prod, pass in a separate address to NEXT_PUBLIC_GATEWAY_ADDRESS
 */
export const wsMatchProxyGatewayAddress = "http://localhost:5002";

export const userApiPathAddress = "http://localhost:5001/api/user-service/";
export const questionApiPathAddress =
  "http://localhost:5004/api/question-service/";
export const matchApiPathAddress =
  "http://localhost:5002/api/matching-service/";
