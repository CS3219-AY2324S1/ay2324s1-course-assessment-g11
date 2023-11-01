import Profile from "../_profile";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { Attempt } from "@/types/UserTypes";
import { useHistory } from "@/hooks/useHistory";
import { useRouter } from "next/router";
import { User } from "firebase/auth";
import { useUser } from "@/hooks/useUser";

export default function Page() {
  const router = useRouter();
  const id = router.query.id;
  const { getAppUser } = useUser();
  const { user: currentUser } = useContext(AuthContext);
  const { fetchAttempts } = useHistory();

  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [user, setUser] = useState<User>();
  const [loadingState, setLoadingState] = useState<"loading" | "error" | "success">("loading");

  useEffect(() => {
    if (currentUser && (typeof id === "string")) {
      Promise.all([getAppUser(id), fetchAttempts(id)]).then(([user, attempts]) => {
        if (user && attempts) {
          user["photoURL"] = user["photoUrl"];
          console.log(user);
          setUser(user);
          setAttempts(attempts);
          setLoadingState("success");
        } else {
          throw new Error("User or attempts not found");
        }
      }).catch((err: any) => {
        setLoadingState("error");
        console.log(err);
      });
    }
  }, [currentUser]);

  return (
    (user && <Profile selectedUser={user} isCurrentUser={user.uid === currentUser?.uid} loadingState={loadingState} attempts={attempts}/>)
  )
}
