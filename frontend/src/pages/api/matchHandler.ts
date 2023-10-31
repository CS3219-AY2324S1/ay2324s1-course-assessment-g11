import { matchApiPathAddress } from "@/gateway-address/gateway-address";
import { Match } from "@/types/MatchTypes";

export const getMatchByRoomid = async (roomId: string) => {
  try {
    const url = `${matchApiPathAddress}match/${roomId}`;

    const response = await fetch(url, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return <Match>{
      roomId: data.roomId,
      userId1: data.userId1,
      userId2: data.userId2,
      chosenDifficulty: data.chosenDifficulty,
      chosenProgrammingLanguage: data.chosenProgrammingLanguage,
      questionId: data.questionId,
      createdAt: data.createdAt,
    };
  } catch (error) {
    console.error("There was an error fetching the match", error);
  }
};
