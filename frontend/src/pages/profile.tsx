import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button";
import { TypographyCode, TypographyH3 } from "@/components/ui/typography";

type UserInfo = {
  name: string
  username: string
  avatar: string
}

interface ProfileProps {
  userInfo: UserInfo
}

const defaultUser: UserInfo = {
  name: "John Doe",
  username: "johndoe",
  avatar: "https://github.com/shadcn.png"
}

export default function Profile({ userInfo = defaultUser }: ProfileProps) {
  return (
    <div className="max-w-7xl mx-auto flex flex-col justify-center items-center">
      <div className="max-w-sm m-4">
        <div className="flex items-center w-full justify-center gap-x-4 p-4">
          <Avatar className="h-24 w-24">
            <AvatarImage src={userInfo.avatar} />
            <AvatarFallback>{userInfo.name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <TypographyH3>{userInfo?.name}</TypographyH3>
            <TypographyCode>@{userInfo?.username}</TypographyCode>
          </div>
        </div>
        <Button className="w-full" variant="secondary">Edit Profile</Button>
      </div>
    </div>
  )
}
