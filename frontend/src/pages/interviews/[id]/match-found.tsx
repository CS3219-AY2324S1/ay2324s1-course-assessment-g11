import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TypographyCode, TypographyH2, TypographyH3 } from "@/components/ui/typography";
import Link from "next/link";

type UserInfo = {
  name: string
  username: string
  avatar: string
}

const defaultUser: UserInfo = {
  name: "John Doe",
  username: "johndoe",
  avatar: "https://github.com/shadcn.png"
}

export default function MatchFound() {
  return (
    <div className='min-h-screen p-12 mx-auto max-w-7xl flex flex-col justify-evenly items-center'>
      <TypographyH2>
        Match Found!
      </TypographyH2>

      <Card className="flex flex-col justify-center items-center gap-y-6">
        <div className="flex items-center w-full justify-center gap-x-4 p-16 shadow-2xl shadow-secondary/50">
          <Avatar className="h-24 w-24">
            <AvatarImage src={defaultUser.avatar} />
            <AvatarFallback>{defaultUser.name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <TypographyH3>{defaultUser?.name}</TypographyH3>
            <TypographyCode>@{defaultUser?.username}</TypographyCode>
          </div>
        </div>
      </Card>

      <div className="flex gap-x-6">
        <Link href="/interviews">
          <Button variant="secondary">Cancel Search</Button>
        </Link>
        <Link href="/interviews/1/find-match">
          <Button variant="secondary">Retry Match</Button>
        </Link>
        <Link href="/room">
          <Button variant="default">Accept Interview</Button>
        </Link>
      </div>
    </div>
  )
}