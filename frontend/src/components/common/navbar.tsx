import Link from "next/link";
import { Button } from "../ui/button";
import Image from "next/image";
import { AuthContext } from "@/contexts/AuthContext";
import { useContext, useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { TypographyBody } from "../ui/typography";
import { useRouter } from "next/router";

enum TabsOptions {
  INTERVIEWS = "interviews",
  QUESTIONS = "questions",
  NULL = "",
}


export default function Navbar() {
  const { user: currentUser, authIsReady } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState<TabsOptions>(TabsOptions.NULL);

  const router = useRouter();
  const currentPage = router.pathname;

  useEffect(() => {
    console.log(currentPage);
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
      <div className="flex py-4 bg-card justify-between items-center px-12">
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
          <Link href="/interviews"><Button variant={"outline"}>Log In</Button></Link>
          <Button>Sign Up</Button>
        </div>}
      </div>
    </header>
  )
}
