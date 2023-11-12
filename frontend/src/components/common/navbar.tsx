import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";

export default function Navbar() {
  const router = useRouter();

  const currentPage = router.pathname;

  return (
    <header>
      <div className="flex h-20 bg-card justify-between items-center px-12">
        <div className="flex gap-20 justify-center items-center">
          <Link href="/">
            <Image
              src="/CodeParty.svg"
              alt="CodeParty logo"
              width={125}
              height={25}
            />
          </Link>
        </div>
      </div>
    </header>
  );
}
