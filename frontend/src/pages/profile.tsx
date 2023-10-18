import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { TypographyCode, TypographyH3 } from "@/components/ui/typography";
import { AuthContext } from "@/contexts/AuthContext";
import { useDeleteOwnAccount } from "@/firebase-client/useDeleteOwnAccount";
import { useLogin } from "@/firebase-client/useLogin";
import { useLogout } from "@/firebase-client/useLogout";
import { useContext } from "react";
import { AiFillGithub } from "react-icons/ai";

type UserInfo = {
  name: string;
  username: string;
  avatar: string;
};

interface ProfileProps {
  userInfo: UserInfo;
}

const defaultUser: UserInfo = {
  name: "John Doe",
  username: "johndoe",
  avatar: "https://github.com/shadcn.png",
};

export default function Profile() {
  const { login, isPending } = useLogin();
  const { logout } = useLogout();
  const { deleteOwnAccount } = useDeleteOwnAccount();

  const { user, authIsReady } = useContext(AuthContext);

  if (!user) {
    return null;
  }

  console.log(user);

  return (
    <div className="max-w-7xl mx-auto flex flex-col justify-center items-center">
      <div className="max-w-sm m-4">
        <div className="flex items-center w-full justify-center gap-x-4 p-4">
          <Avatar className="h-24 w-24">
            <AvatarImage src={user.photoURL || ""} />
            <AvatarFallback>{user.displayName}</AvatarFallback>
          </Avatar>
          <div>
            <TypographyH3>{user.displayName}</TypographyH3>
            <TypographyCode>@{user.displayName}</TypographyCode>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <Button className="w-full" variant="secondary">
            Edit Profile
          </Button>

          {authIsReady ? (
            user ? (
              [
                <Button
                  key="logout"
                  className="w-full"
                  variant="secondary"
                  onClick={logout}
                >
                  <AiFillGithub className="mr-2 w-6 h-6" />
                  {isPending && !authIsReady ? "Loading..." : "Sign out"}
                </Button>,
                <Button
                  key="deleteAccount"
                  className="w-full"
                  variant="secondary"
                  onClick={deleteOwnAccount}
                >
                  <AiFillGithub className="mr-2 w-6 h-6" />
                  {isPending ? "Loading..." : "Delete your account on this app"}
                </Button>,
              ]
            ) : (
              <Button className="mb-16" onClick={login}>
                <AiFillGithub className="mr-2 w-6 h-6" />
                {isPending ? "Loading..." : "Sign up with GitHub"}
              </Button>
            )
          ) : (
            <div>Loading authentication status. Please wait...</div>
          )}
        </div>
      </div>
    </div>
  );
}
