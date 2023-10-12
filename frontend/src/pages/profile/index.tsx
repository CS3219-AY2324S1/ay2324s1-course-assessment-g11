import { useContext } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button";
import { TypographyBody, TypographyH3 } from "@/components/ui/typography";
import { AuthContext } from "@/contexts/AuthContext";
import Link from "next/link";

export default function Profile() {
  const { user: currentUser, authIsReady } = useContext(AuthContext);

  const getInitials = (name: string) => {
    const names = name.split(" ");
    let initials = "";
    names.forEach((n) => {
      initials += n[0].toUpperCase();
    });
    return initials;
  }

  return (
    <div className="max-w-7xl mx-auto flex flex-col justify-center items-center">
      <div className="max-w-sm m-4">
        <div className="flex items-center w-full justify-center gap-x-4 p-4">
          <Avatar className="h-24 w-24">
            <AvatarImage src={currentUser?.photoURL || ''} />
            <AvatarFallback>{getInitials(currentUser?.displayName || '')}</AvatarFallback>
          </Avatar>
          <div>
            <TypographyH3>{currentUser?.displayName}</TypographyH3>
            <TypographyBody>{currentUser?.email}</TypographyBody>
          </div>
        </div>
        <Link href="/settings"><Button className="w-full" variant="secondary">Edit Profile</Button></Link>
      </div>
    </div>
  )
}
