import { userApiPathAddress } from "@/gateway-address/gateway-address";

export const getAttemptsOfUser = async (user: any, uid: string) => {
  try {
    const url = `${userApiPathAddress}api/${uid}/attempts`;
    const idToken = await user.getIdToken(true);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "User-Id-Token": idToken,
      },
    });

    if (!response.ok) {
      throw new Error(`Unable to get attempts: ${await response.text()}`);
    }
    return response.json();
  } catch (error) {
    console.error("There was an error fetching the attempts", error);
    throw error;
  }
};

export const createAttemptOfUser = async (user: any, data: any) => {
  try {
    const url = `${userApiPathAddress}api/attempt`;
    const idToken = await user.getIdToken(true);

    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        "User-Id-Token": idToken,
      },
    });

    if (!response.ok) {
      throw new Error(`Unable to create attempt: ${await response.text()}`);
    }
    return response.json();
  } catch (error) {
    console.error("There was an error creating the attempt", error);
    throw error;
  }
};
