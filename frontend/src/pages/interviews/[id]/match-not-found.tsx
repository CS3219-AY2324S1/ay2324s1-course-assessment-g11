import { Button } from "@/components/ui/button";
import { TypographyBody, TypographyH2 } from "@/components/ui/typography";
import Link from "next/link";

export default function MatchFound() {
  return (
    <div className='min-h-screen p-12 mx-auto max-w-7xl flex flex-col justify-evenly items-center'>
      <TypographyH2>
        Sorry, we couldn’t find anyone :(
      </TypographyH2>

      <TypographyBody>
        Please come back later to find a peer to practice interviewing with!
      </TypographyBody>

      <Link href="/interviews">
        <Button variant="secondary">Return Home</Button>
      </Link>
    </div>
  )
}
