import Link from "next/link";
import { Button } from "./ui/button";
import { TypographyH3 } from "./ui/typography";

export default function Navbar() {
  return (
    <header>
      <div className="flex py-4 bg-card justify-between items-center px-12">
        <Link href="/"><TypographyH3 className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Forced Prep</TypographyH3></Link>
        <div className="grid grid-cols-2 gap-4">
          <Link href="/interviews"><Button variant={"outline"}>Log In</Button></Link>
          <Button>Sign Up</Button>
        </div>
      </div>
    </header>
  )
}