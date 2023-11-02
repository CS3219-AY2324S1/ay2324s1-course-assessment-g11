import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  TypographyCode,
  TypographyH2,
  TypographyH3,
} from "@/components/ui/typography";
import { AuthContext } from "@/contexts/AuthContext";
import { useMatchmaking } from "@/hooks/useMatchmaking";
import { useUser } from "@/hooks/useUser";
import { query } from "express";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";

type UserInfo = {
  displayName: string;
  photoUrl: string;
};

const defaultUser: UserInfo = {
  displayName: "John Doe",
  photoUrl: "https://github.com/shadcn.png",
};

export default function MatchFound() {
  const router = useRouter();
  const { match, leaveMatch, joinQueue, cancelLooking } = useMatchmaking();
  const { user, authIsReady } = useContext(AuthContext);
  const [otherUser, setOtherUser] = useState<UserInfo>(defaultUser);

  const { getAppUser } = useUser();

  useEffect(() => {
    const fetchOtherUser = async () => {
      const otherUserId =
        match?.userId1 === user?.uid ? match?.userId2 : match?.userId1;

      const other = await getAppUser(otherUserId, false);
      setOtherUser(other);

      console.log(other);
    };

    if (user && authIsReady) {
      fetchOtherUser();
    }
  }, [user, authIsReady, match]);

  const onClickCancel = () => {
    leaveMatch();
    router.push("/interviews");
  };

  const onClickRetry = () => {
    cancelLooking();
    joinQueue(["easy", "medium", "hard"], "python");
    router.push("/interviews/find-match");
  };

  const onClickAccept = () => {
    router.push(`/room/${match?.roomId}`);
  };

  return (
    <div className="min-h-screen p-12 mx-auto max-w-7xl flex flex-col justify-evenly items-center">
      <TypographyH2>Match Found!</TypographyH2>

      <Card className="flex flex-col justify-center items-center gap-y-6">
        <div className="flex items-center w-full justify-center gap-x-4 p-16 shadow-2xl shadow-secondary/50">
          <Avatar className="h-24 w-24">
            <AvatarImage src={otherUser.photoUrl} />
            <AvatarFallback>
              {defaultUser.displayName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <TypographyH3>{otherUser?.displayName ?? "Annoymous"}</TypographyH3>
            {/* <TypographyCode>@{otherUser?.displayName}</TypographyCode> */}
          </div>
        </div>
      </Card>

      <div className="flex gap-x-6">
        <Button variant="secondary" onClick={onClickCancel}>
          Cancel Search
        </Button>
        <Button variant="secondary" onClick={onClickRetry}>
          Retry Match
        </Button>
        <Button variant="default" onClick={onClickAccept}>
          Accept Interview
        </Button>
      </div>
    </div>
  );
}
