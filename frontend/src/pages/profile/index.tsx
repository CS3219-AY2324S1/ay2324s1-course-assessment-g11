import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import Profile from "./_profile";

export default function Page() {
  const { user: currentUser } = useContext(AuthContext);
  const [loadingState, setLoadingState] = useState<
    "loading" | "error" | "success"
  >("loading");

  return (
    currentUser && (
      <Profile
        selectedUser={currentUser}
        isCurrentUser={true}
        loadingState={loadingState}
      />
    )
  );
}
