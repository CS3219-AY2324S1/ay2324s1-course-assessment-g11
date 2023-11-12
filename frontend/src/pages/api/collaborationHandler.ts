import { collaborationApiPathAddress } from "@/gateway-address/gateway-address";

export const fetchRoomData = async (roomId: string, user: any) => {
  try {
    const url = `${collaborationApiPathAddress}room/${roomId}`;
    const idToken = await user.getIdToken(true);

    const response = await fetch(url, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        "User-Id-Token": idToken,
      },
    });

    const data = await response.json();

    if (data && data.room_id) {
      return {
        message: data.message,
        roomId: data.room_id,
        questionId: data.questionId,
        info: data.info,
      };
    } else {
      throw new Error("Invalid data format from the server");
    }
  } catch (error) {
    console.error("There was an error fetching the room data", error);
    throw error;
  }
};
