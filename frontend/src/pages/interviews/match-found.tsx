import { languages } from "@/components/room/code-editor";
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
import { Difficulty } from "@/types/QuestionTypes";
import { query } from "express";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

type UserInfo = {
  displayName: string;
  photoUrl: string;
};

const defaultUser: UserInfo = {
  displayName: "Loading...",
  photoUrl: "",
};

export default function MatchFound() {
  const router = useRouter();
  const { match, leaveMatch, joinQueue, cancelLooking } = useMatchmaking();
  const { user, authIsReady } = useContext(AuthContext);
  const [otherUser, setOtherUser] = useState<UserInfo>(defaultUser);

  const { getAppUser } = useUser();
  const [isLoading, setIsLoading] = useState(true);

  const [difficulty, setDifficulty] = useState<Difficulty[]>(["medium"]);
  const [selectedLanguage, setSelectedLanguage] = useState(
    languages.length > 0 ? languages[0].value : "c++"
  );

  useEffect(() => {
    if (user) {
      getAppUser().then((user) => {
        if (user) {
          setDifficulty([user.matchDifficulty as Difficulty] || difficulty);
          setSelectedLanguage(
            user.matchProgrammingLanguage || selectedLanguage
          );
        }
        setIsLoading(false);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    if (!match) {
      toast("Other user has left");
      router.push("/interviews");
    } else {
      const fetchOtherUser = async () => {
        const otherUserId =
          match?.userId1 === user?.uid ? match?.userId2 : match?.userId1;

        const other = await getAppUser(otherUserId, false);
        if (other) {
          setOtherUser({
            displayName: other.displayName || "Anonymous",
            photoUrl: other.photoUrl || defaultUser.photoUrl,
          });
        }

        console.log(other);
      };

      if (user && authIsReady) {
        fetchOtherUser();
      }
    }
  }, [user, authIsReady, match]);

  const onClickCancel = () => {
    leaveMatch();
    router.push("/interviews");
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
        {/* <Button variant="secondary" onClick={onClickRetry}>
          Retry Match
        </Button> */}
        <Button variant="default" onClick={onClickAccept}>
          Accept Interview
        </Button>
      </div>
    </div>
  );
}
