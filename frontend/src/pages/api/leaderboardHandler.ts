import { userApiPathAddress } from "@/gateway-address/gateway-address";

export const getLeaderboard = async (user: any) => {
  try {
    const url = `${userApiPathAddress}leaderboard`;
    const idToken = await user.getIdToken(true);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "User-Id-Token": idToken,
      },
    });

    if (!response.ok) {
      throw new Error(`Unable to get leaderboard: ${await response.text()}`);
    }
    return response.json().then((arr: Array<any>) => {
      return arr.map((obj) => {
        obj["time_saved_at"] = new Date(obj["time_saved_at"]);
        obj["time_updated"] = new Date(obj["time_updated"]);
        obj["time_created"] = new Date(obj["time_created"]);
        return obj;
      });
    });
  } catch (error) {
    console.error("There was an error fetching the leaderboard", error);
    throw error;
  }
};
