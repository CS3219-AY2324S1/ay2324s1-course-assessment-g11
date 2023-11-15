import { userApiPathAddress } from "@/gateway-address/gateway-address";
import { Attempt } from "@/types/UserTypes";

export const getAttemptsOfUser = async (user: any, uid: string) => {
  try {
    const url = `${userApiPathAddress}${uid}/attempts`;
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
    return response.json().then((arr: Array<any>) => {
      return arr.map(obj => {
        obj["time_saved_at"] = new Date(obj["time_saved_at"]);
        obj["time_updated"] = new Date(obj["time_updated"]);
        obj["time_created"] = new Date(obj["time_created"]);
        return obj
      });
    });
  } catch (error) {
    console.error("There was an error fetching the attempts", error);
    throw error;
  }
};

export const getAttemptById = async (user: any, attemptId: string) => {
  try {
    const url = `${userApiPathAddress}attempt/${attemptId}`;
    const idToken = await user.getIdToken(true);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "User-Id-Token": idToken,
      },
    });

    if (!response.ok) {
      throw new Error(`Unable to get attempt: ${await response.text()}`);
    }
    return response.json().then(val => {
      val["time_saved_at"] = new Date(val["time_saved_at"]);
      val["time_updated"] = new Date(val["time_updated"]);
      val["time_created"] = new Date(val["time_created"]);
      return val
    });
  } catch (error) {
    console.error("There was an error fetching the attempt", error);
    throw error;
  }
};

export const createAttemptOfUser = async (user: any, data: any) => {
  try {
    const url = `${userApiPathAddress}attempt`;
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
