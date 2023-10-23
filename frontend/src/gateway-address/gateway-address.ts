/**
 * File for defining the address of the gateway server.
 *
 * How to use:
 *   - Leave NEXT_PUBLIC_GATEWAY_ADDRESS empty for dev environments
 *   - For prod, pass in a separate address to NEXT_PUBLIC_GATEWAY_ADDRESS
 */
const gatewayAddress = process.env.NEXT_PUBLIC_GATEWAY_ADDRESS || "http://localhost:4000/"

export const userApiPathAddress = gatewayAddress + "api/user-service/";
export const questionApiPathAddress = gatewayAddress + "api/question-service/";

export const collaborationSocketAddress = gatewayAddress + "collaboration/socket.io";
export const matchSocketAddress = gatewayAddress + "match/socket.io";
