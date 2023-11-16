import Link from "next/link";
import { Button } from "../ui/button";
import Image from "next/image";
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

enum TabsOptions {
  QUESTIONS = "questions",
  NULL = "",
}

export default function Navbar() {
  const [activeTab, setActiveTab] = useState<TabsOptions>(TabsOptions.NULL);

  const router = useRouter();

  const currentPage = router.pathname;

  useEffect(() => {
    if (currentPage === "/questions") {
      setActiveTab(TabsOptions.QUESTIONS);
    } else {
      setActiveTab(TabsOptions.NULL);
    }
  }, [currentPage]);

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
            <div className="h-12 flex justify-center items-center">
              <Tabs value={activeTab}>
                <TabsList>
                  <Link href="/questions">
                    <TabsTrigger
                      value="questions"
                      className="h-20 w-36 hover:bg-accent duration-100"
                    >
                      Questions
                    </TabsTrigger>
                  </Link>
                </TabsList>
              </Tabs>
            </div>
        </div>
      </div>
    </header>
  );
}
