import { matchApiPathAddress } from "@/gateway-address/gateway-address";
import { Match } from "@/types/MatchTypes";

export const getMatchByRoomid = async (user: any, roomId: string) => {
  try {
    const url = `${matchApiPathAddress}match/${roomId}`;
    const idToken = await user.getIdToken(true);

    const response = await fetch(url, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        "User-Id-Token": idToken,
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    if (!data) {
      throw new Error("There was an error fetching the match");
    } else if (data.error) {
      throw new Error(data.error);
    } else if (!data.info) {
      throw new Error("There was an error fetching the match");
    }
    return <Match>{
      roomId: data.info.roomId,
      userId1: data.info.userId1,
      userId2: data.info.userId2,
      chosenDifficulty: data.info.chosenDifficulty,
      chosenProgrammingLanguage: data.info.chosenProgrammingLanguage,
      questionId: data.info.questionId,
      createdAt: data.info.createdAt,
    };
  } catch (error) {
    console.error("There was an error fetching the match", error);
  }
};
