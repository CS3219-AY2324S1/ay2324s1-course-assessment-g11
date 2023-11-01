import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import Profile from "./_profile";
import { Attempt } from "@/types/UserTypes";
import { useHistory } from "@/hooks/useHistory";

export default function Page() {
  const { user: currentUser } = useContext(AuthContext);
  const { fetchAttempts } = useHistory();

  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [loadingState, setLoadingState] = useState<"loading" | "error" | "success">("loading");

  useEffect(() => {
    if (currentUser) {
      fetchAttempts(currentUser.uid).then((attempts) => {
        if (attempts) {
          setAttempts(attempts);
          setLoadingState("success");
        }
      }).catch((err: any) => {
        setLoadingState("error");
        console.log(err);
      });
    }
  }, [currentUser]);

  return (
    (currentUser && <Profile selectedUser={currentUser} isCurrentUser={true} loadingState={loadingState} attempts={attempts}/>)
  )
}
