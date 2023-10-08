import Loader from "@/components/interviews/loader";
import { Button } from "@/components/ui/button";
import { TypographyBody, TypographyH2 } from "@/components/ui/typography";
import Link from "next/link";

export default function FindMatch() {
  return (
    <div className='h-[calc(100vh-80px)] p-12 mx-auto max-w-7xl flex flex-col justify-evenly items-center'>
      <div className="gap-y-6 flex flex-col justify-center items-center">
        <TypographyH2>
          Finding a match for your interview prep...
        </TypographyH2>

        <TypographyBody>
          Estimated time: 25 secs
        </TypographyBody>
      </div>

      <Loader />

      <Link href="interviews">
        <Button variant="secondary">Cancel Search</Button>
      </Link>
    </div>
  )
}