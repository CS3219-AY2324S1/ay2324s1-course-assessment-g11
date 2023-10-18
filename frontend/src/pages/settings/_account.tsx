import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-dropdown-menu";
import { useDeleteOwnAccount } from "@/firebase-client/useDeleteOwnAccount";
import { useUser } from "@/hooks/useUser";
import { AuthContext } from "@/contexts/AuthContext";
import { useContext, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { TypographyH3 } from "@/components/ui/typography";
import { EditableUser } from "@/types/UserTypes";

export default function AccountSettingsCard() {
  const { user: currentUser } = useContext(AuthContext);
  const { deleteOwnAccount } = useDeleteOwnAccount();
  const { updateUser } = useUser();

  console.log(currentUser);
  const [updatedUser, setUpdatedUser] = useState<EditableUser>({ uid: currentUser?.uid ?? '' } as EditableUser);

  useEffect(() => {
    console.log(updatedUser);
  }, [updatedUser]);

  return (
    <Card id="account" className="p-10">
      <CardHeader>
        <CardTitle>Account</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="flex flex-col gap-y-10">
          <div>
            <Label className="mb-2">Display Name</Label>
            <Input
              placeholder="Name"
              defaultValue={currentUser?.displayName ?? ''}
              onChange={(event) =>
                setUpdatedUser((prev: any) => ({ ...prev, displayName: event.target.value } as EditableUser))
              }
              className="max-w-sm"
            />
          </div>
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
          <Button className="w-fit" onClick={() => updateUser(updatedUser)}>Save Changes</Button>
          <div>
            <TypographyH3 className="mb-4">Danger Zone</TypographyH3>
            <Button variant="outline" className="border-destructive text-destructive w-fit" onClick={deleteOwnAccount}>
              Delete Account
            </Button>
          </div>
        </CardDescription>
      </CardContent>
    </Card>
  )
}