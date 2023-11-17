import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { TypographyBody, TypographyH3 } from "@/components/ui/typography";
import Link from "next/link";

export type UserProfile = {
  uid: string;
  displayName?: string | null;
  photoURL?: string | null;
  email?: string | null;
};

type ProfileProps = {
  selectedUser: UserProfile;
  loadingState: "loading" | "error" | "success";
  isCurrentUser: boolean;
};

export default function Profile({ selectedUser, isCurrentUser }: ProfileProps) {
  console.log(selectedUser);
  const getInitials = (name: string) => {
    if (!name) return "Annonymous";
    return name;
  };

  return (
    <div className="max-w-7xl mx-auto flex justify-center items-start">
      <div className="max-w-sm mx-4 my-20">
        <div className="flex items-center w-full justify-center gap-x-4 p-4">
          <Avatar className="h-24 w-24">
            <AvatarImage src={selectedUser?.photoURL ?? ""} />
            <AvatarFallback>
              {getInitials(selectedUser?.displayName ?? "")}
            </AvatarFallback>
          </Avatar>
          <div>
            <TypographyH3>{selectedUser?.displayName}</TypographyH3>
            <TypographyBody>{selectedUser?.email}</TypographyBody>
          </div>
        </div>
        {isCurrentUser && (
          <Link href="/settings">
            <Button className="w-full" variant="secondary">
              Edit Profile
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
