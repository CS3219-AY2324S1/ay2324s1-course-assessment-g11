import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { TypographyH1, TypographyH3 } from "@/components/ui/typography";
import { Label } from "@radix-ui/react-dropdown-menu";
import { UserIcon } from "lucide-react";
import { useRouter } from "next/router";
import { AuthContext } from "@/contexts/AuthContext";
import { useContext } from "react";
import { useDeleteOwnAccount } from "@/firebase-client/useDeleteOwnAccount";

const settingsOptions = [
  {
    title: "Account",
    href: "/settings/#account",
    icon: UserIcon,
  },
]

export default function Settings() {
  const router = useRouter();
  const { user: currentUser } = useContext(AuthContext);
  const { deleteOwnAccount } = useDeleteOwnAccount();

  return (
    <div className="max-w-7xl mx-auto py-10">
      <div className="flex">
        <div className="items-start w-60">
          <div className="sticky w-60">
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
          <Card id="account" className="p-10">
            <CardHeader>
              <CardTitle>Account</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="flex flex-col gap-y-10">
                <div>
                  <Label className="mb-2">Email</Label>
                  <Input
                    placeholder="Email"
                    value={currentUser?.email ?? ''}
                    disabled={true}
                    onChange={(event) =>
                      console.log(event.target.value)
                    }
                    className="max-w-sm"
                  />
                </div>
                <div>
                  <Label className="mb-2">Name</Label>
                  <Input
                    placeholder="Name"
                    value={currentUser?.displayName ?? ''}
                    disabled={true}
                    onChange={(event) =>
                      console.log(event.target.value)
                    }
                    className="max-w-sm"
                  />
                </div>
                <Button className="w-fit">Save Changes</Button>
                <div>
                  <TypographyH3 className="mb-4">Danger Zone</TypographyH3>
                  <Button variant="outline" className="border-destructive text-destructive w-fit" onClick={deleteOwnAccount}>
                    Delete Account
                  </Button>
                </div>
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
