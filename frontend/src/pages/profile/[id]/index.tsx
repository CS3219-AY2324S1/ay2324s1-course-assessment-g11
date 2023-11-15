import Profile, {UserProfile} from "../_profile";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { Attempt } from "@/types/UserTypes";
import { useHistory } from "@/hooks/useHistory";
import { useRouter } from "next/router";
import { useUser } from "@/hooks/useUser";

export default function Page() {
  const router = useRouter();
  const id = router.query.id;
  const { getAppUser } = useUser();
  const { user: currentUser } = useContext(AuthContext);
  const { fetchAttempts } = useHistory();

  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [user, setUser] = useState<UserProfile>();
  const [loadingState, setLoadingState] = useState<
    "loading" | "error" | "success"
  >("loading");

  useEffect(() => {
    if (currentUser && typeof id === "string") {
      Promise.all([getAppUser(id, false), fetchAttempts(id)])
        .then(([user, attempts]) => {
          if (user && attempts) {
            console.log(user);
            setUser({...user, photoURL: user.photoUrl});
            setAttempts(attempts);
            setLoadingState("success");
          } else {
            throw new Error("User or attempts not found");
          }
        })
        .catch((err: any) => {
          setLoadingState("error");
          console.log(err);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  return (
    user && (
      <Profile
        selectedUser={user}
        isCurrentUser={user.uid === currentUser?.uid}
        loadingState={loadingState}
        attempts={attempts}
      />
    )
  );
}
