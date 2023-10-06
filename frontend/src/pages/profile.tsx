import { TypographyCode, TypographyH1, TypographyH3 } from "@/components/ui/typography";
import { use } from "react";

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
  avatar: "https://avatars.githubusercontent.com/u/1?v=4"
}

export default function Profile({ userInfo = defaultUser }: ProfileProps) {
  return (
    <div className="max-w-7xl mx-auto">
      <TypographyH3>{userInfo?.name}</TypographyH3>
      <TypographyCode>@{userInfo?.username}</TypographyCode>
    </div>
  )
}