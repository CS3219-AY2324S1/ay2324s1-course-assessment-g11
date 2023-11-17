import { Button } from "@/components/ui/button";

import { TypographyH1 } from "@/components/ui/typography";

import { useRouter } from "next/router";
import AccountSettingsCard from "./_account";

export default function Settings() {
  const router = useRouter();

  return (
    <div className="max-w-7xl mx-auto py-10">
      <div className="flex">
        <div className="w-full p-10 m-10 flex flex-col gap-10">
          <TypographyH1>Settings</TypographyH1>
          <AccountSettingsCard />
          <Button
            className="w-full gap-2"
            onClick={() => router.push("/profile")}
          >
            Back to profile
          </Button>
        </div>
      </div>
    </div>
  );
}
