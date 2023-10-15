/**
 * File for defining the address of the gateway server.
 *
 * How to use:
 *   - Leave GATEWAY_ADDRESS empty for dev environments
 *   - For prod, pass in a separate address to GATEWAY_ADDRESS
 */
const gatewayAddress = process.env.GATEWAY_ADDRESS || "http://localhost:4000/"

export const userApiPathAddress = gatewayAddress + "api/user-service/";
export const questionApiPathAddress = gatewayAddress + "api/question-service/";
