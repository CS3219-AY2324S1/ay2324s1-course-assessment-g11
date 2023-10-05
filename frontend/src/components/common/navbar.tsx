import Link from "next/link";
import { Button } from "../ui/button";
import Image from "next/image";

export default function Navbar() {
  return (
    <header>
      <div className="flex py-4 bg-card justify-between items-center px-12">
        <Link href="/"><Image src="/CodeParty.svg" alt="CodeParty logo" width={125} height={25}/></Link>
        <div className="grid grid-cols-2 gap-4">
          <Link href="/interviews"><Button variant={"outline"}>Log In</Button></Link>
          <Button>Sign Up</Button>
        </div>
      </div>
    </header>
  )
}
