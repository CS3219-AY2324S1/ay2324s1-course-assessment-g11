import { userApiPathAddress } from "@/gateway-address/gateway-address";
import { EditableUser } from "@/types/UserTypes";

export const updateUserByUid = async (user: EditableUser, currentUser: any) => {
  try {
    const url = `${userApiPathAddress}${currentUser.uid}`;
    const idToken = await currentUser.getIdToken(true);

    console.log("user", user);

    const response = await fetch(url, {
      method: "PUT",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        "User-Id-Token": idToken,
        "User-Id": currentUser.uid
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

export const getUserByUid = async (uid: string, currentUser: any) => {
  try {
    const url = `${userApiPathAddress}${uid}`;
    const idToken = await currentUser.getIdToken(true);

    const response = await fetch(url, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        "User-Id-Token": idToken,
        "User-Id": currentUser.uid
      },
    });

    const data = await response.json();
    if (response.status === 200) {
      return data;
    } else {
      throw new Error(response.statusText);
    }
  } catch (error) {
    console.error("There was an error getting the user", error);
    throw error;
  }
};