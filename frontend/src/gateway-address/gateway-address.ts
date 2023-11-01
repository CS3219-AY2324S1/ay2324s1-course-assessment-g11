/**
 * File for defining the address of the gateway server.
 *
 * How to use:
 *   - Leave NEXT_PUBLIC_GATEWAY_ADDRESS empty for dev environments
 *   - For prod, pass in a separate address to NEXT_PUBLIC_GATEWAY_ADDRESS
 */
const httpProxyGatewayAddress =
  process.env.NEXT_PUBLIC_HTTP_PROXY_GATEWAY_ADDRESS ||
  "http://localhost:4000/";
export const wsMatchProxyGatewayAddress =
  process.env.NEXT_PUBLIC_WS_MATCH_PROXY_GATEWAY_ADDRESS ||
  "http://localhost:4002";
export const wsCollaborationProxyGatewayAddress =
  process.env.NEXT_PUBLIC_WS_COLLABORATION_PROXY_GATEWAY_ADDRESS ||
  "http://localhost:4003";

export const userApiPathAddress = httpProxyGatewayAddress + "api/user-service/";
export const questionApiPathAddress =
  httpProxyGatewayAddress + "api/question-service/";
export const matchApiPathAddress =
  httpProxyGatewayAddress + "api/matching-service/";
