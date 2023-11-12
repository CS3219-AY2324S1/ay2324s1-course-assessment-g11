import Profile, { UserProfile } from "../_profile";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { useRouter } from "next/router";
import { useUser } from "@/hooks/useUser";

export default function Page() {
  const router = useRouter();
  const id = router.query.id;
  const { getAppUser } = useUser();
  const { user: currentUser } = useContext(AuthContext);

  const [user, setUser] = useState<UserProfile>();
  const [loadingState, setLoadingState] = useState<
    "loading" | "error" | "success"
  >("loading");

  return (
    user && (
      <Profile
        selectedUser={user}
        isCurrentUser={user.uid === currentUser?.uid}
        loadingState={loadingState}
      />
    )
  );
}
