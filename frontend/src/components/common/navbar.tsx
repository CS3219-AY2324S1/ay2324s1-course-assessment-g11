import Link from "next/link";
import { Button } from "../ui/button";
import Image from "next/image";
import { AuthContext } from "@/contexts/AuthContext";
import { useContext, useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { useRouter } from "next/router";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLogout } from "@/firebase-client/useLogout";
import { useLogin } from "@/firebase-client/useLogin";

enum TabsOptions {
  INTERVIEWS = "interviews",
  QUESTIONS = "questions",
  NULL = "",
}

export default function Navbar() {
  const { user: currentUser, authIsReady } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState<TabsOptions>(TabsOptions.NULL);

  const { login } = useLogin();
  const { logout } = useLogout();
  const router = useRouter();

  const currentPage = router.pathname;

  useEffect(() => {
    if (currentPage === "/interviews") {
      setActiveTab(TabsOptions.INTERVIEWS);
    } else if (currentPage === "/questions") {
      setActiveTab(TabsOptions.QUESTIONS);
    } else {
      setActiveTab(TabsOptions.NULL);
    }
  }, [currentPage]);

  return (
    <header>
      <div className="flex h-20 bg-card justify-between items-center px-12">
        <div className="flex gap-20 justify-center items-center">
          <Link href="/"><Image src="/CodeParty.svg" alt="CodeParty logo" width={125} height={25} /></Link>
          {currentUser && <div className="h-12 flex justify-center items-center">
            <Tabs value={activeTab}>
              <TabsList>
                <Link href="/interviews">
                  <TabsTrigger value="interviews" className="h-20 w-36 hover:bg-accent duration-100">
                    Interviews
                  </TabsTrigger>
                </Link>
                <Link href="/questions">
                  <TabsTrigger value="questions" className="h-20 w-36 hover:bg-accent duration-100">
                    Questions
                  </TabsTrigger>
                </Link>
              </TabsList>
            </Tabs>
          </div>}
        </div>
        {!currentUser && <div className="grid grid-cols-2 gap-4">
          <Button variant={"outline"} onClick={login}>Log In</Button>
          <Button onClick={login}>Sign Up</Button>
        </div>}
        {currentUser &&
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex justify-center items-center gap-2 h-14">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={currentUser.photoURL || ''} className="rounded-full" />
                </Avatar>
                <ChevronDown className="w-6 h-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel className="hover:bg-card" onClick={() => router.push("/profile")}>
                Profile
              </DropdownMenuLabel>
              <DropdownMenuLabel className="hover:bg-card" onClick={() => router.push("/settings")}>
                Settings
              </DropdownMenuLabel>
              <DropdownMenuLabel className="hover:bg-card" onClick={logout}>
                Log Out
              </DropdownMenuLabel>
            </DropdownMenuContent>
          </DropdownMenu>
        }
      </div>
    </header>
  )
}
