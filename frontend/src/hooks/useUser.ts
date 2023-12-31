import { useContext } from "react";
import {
  updateUserByUid as updateUserApi,
  getUserByUid as getUserApi,
} from "./../pages/api/userHandler";
import { AuthContext } from "@/contexts/AuthContext";
import { EditableUser } from "@/types/UserTypes";

export const useUser = () => {
  const { user: currentUser, authIsReady } = useContext(AuthContext);

  const updateUser = async (updatedUser: EditableUser) => {
    if (authIsReady) {
      return updateUserApi(updatedUser, currentUser);
    }
  };

  const getAppUser = async (userId?: string, fetchSelf: boolean = true) => {
    if (authIsReady) {
      if (fetchSelf) {
        return getUserApi(currentUser?.uid || "", currentUser);
      } else {
        return getUserApi(userId || "", currentUser);
      }
    }
  };

  return { updateUser, getAppUser };
};
