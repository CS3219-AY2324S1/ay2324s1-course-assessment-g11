import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import Profile from "./_profile";

export default function Page() {
  const { user: currentUser } = useContext(AuthContext);

  return (
    (currentUser && <Profile selectedUser={currentUser} isCurrentUser={true} />)
  )
}
