import { Button } from "@/components/ui/button";

import { TypographyH1 } from "@/components/ui/typography";

import { UserIcon, Settings2Icon } from "lucide-react";
import { useRouter } from "next/router";
import AccountSettingsCard from "./_account";

const settingsOptions = [
  {
    title: "Account",
    href: "/settings/#account",
    icon: UserIcon,
  },
  {
    title: "Match Preferences",
    href: "/settings/#match",
    icon: Settings2Icon,
  },
]

export default function Settings() {
  const router = useRouter();

  return (
    <div className="max-w-7xl mx-auto py-10">
      <div className="flex">
        <div className="items-start w-60">
          <div className="fixed w-60">
            <TypographyH1>Settings</TypographyH1>
            <div>
              {settingsOptions.map((option) => (
                <div key={option.href}>
                  <Button variant="ghost" className="justify-start w-full gap-2" onClick={() => router.push(option.href)}>
                    <option.icon size={24} />
                    {option.title}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="w-full p-10 m-10 flex flex-col gap-10">
          <AccountSettingsCard />
        </div>
      </div>
    </div>
  )
}
