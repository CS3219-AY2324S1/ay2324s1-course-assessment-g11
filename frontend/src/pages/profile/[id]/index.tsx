import Profile from "../_profile";
import { User } from "firebase/auth";

export default function Page() {
  // TODO: retrieve selected user from user id in url

  const selectedUser = {
    displayName: "John Doe",
    email: "johndoe@email.com",
    photoURL: "https://www.gravatar.com/avatar/00",
  }

  // TODO: if selected user is null, redirect to 404 page
  return (
    <Profile selectedUser={selectedUser as User} isCurrentUser={false} />
  )
}
