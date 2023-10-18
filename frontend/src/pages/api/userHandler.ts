import { userApiPathAddress } from "@/firebase-client/gateway-address";
import { EditableUser } from "@/types/UserTypes";

export const updateUserByUid = async (user: EditableUser, currentUser: any) => {
  try {
    const url = `${userApiPathAddress}/:${currentUser.uid}}`;
    const idToken = await currentUser.getIdToken(true);

    console.log("user", user);

    const response = await fetch(url, {
      method: "PUT",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        "User-Id-Token": idToken,
      },
      body: JSON.stringify(user),
    });

    const data = await response.json();
    if (response.status === 201) {
      return data;
    }
  } catch (error) {
    console.error("There was an error updating the user", error);
    throw error;
  }
};
