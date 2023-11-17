import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-dropdown-menu";
import { useDeleteOwnAccount } from "@/firebase-client/useDeleteOwnAccount";
import { useUser } from "@/hooks/useUser";
import { AuthContext } from "@/contexts/AuthContext";
import { useContext, useEffect, useRef, useState } from "react";
import { TypographyH3 } from "@/components/ui/typography";
import { EditableUser } from "@/types/UserTypes";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useUpdateProfile } from "../../firebase-client/useUpdateProfile";
import { Button } from "@/components/ui/button";

export default function AccountSettingsCard() {
  const { user: currentUser } = useContext(AuthContext);
  const { deleteOwnAccount } = useDeleteOwnAccount();
  const { updateUserProfile } = useUpdateProfile();
  // const saveButtonRef = useRef<HTMLButtonElement>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const { updateUser } = useUser();
  const [updatedUser, setUpdatedUser] = useState<EditableUser>({
    uid: currentUser?.uid ?? "",
  } as EditableUser);

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
              defaultValue={currentUser?.displayName ?? ""}
              onChange={(event) =>
                setUpdatedUser(
                  (prev: any) =>
                    ({
                      ...prev,
                      displayName: event.target.value,
                    } as EditableUser)
                )
              }
              className="max-w-sm"
            />
          </div>
          <div>
            <Label className="mb-2">Email</Label>
            <Input
              placeholder="Email"
              value={currentUser?.email ?? ""}
              disabled={true}
              onChange={(event) => console.log(event.target.value)}
              className="max-w-sm"
            />
          </div>
          <div className="flex flex-row items-center gap-x-2">
            <Button
              className="inline-flex items-center justify-center rounded-md text-base font-semibold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-30 cursor-pointer bg-primary text-primary-foreground hover:bg-primary/80 h-12 px-4 py-3"
              type="submit"
              onClick={() => {
                if (!updatedUser.displayName) {
                  return;
                }
                updateUser(updatedUser);
                updateUserProfile({
                  displayName: updatedUser.displayName,
                }).then(() => {
                  setShowSuccess(true);
                });
              }}
            >
              Save Changes
            </Button>
            {showSuccess && (
              <span className="text-green-500">
                Successfully updated user profile!
              </span>
            )}
          </div>

          <div>
            <TypographyH3 className="mb-4">Danger Zone</TypographyH3>
            <AlertDialog>
              <AlertDialogTrigger>
                <div className="border-destructive w-fit inline-flex items-center justify-center rounded-md text-base font-semibold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-30 cursor-pointer bg-destructive text-destructive-foreground hover:bg-destructive/90 h-12 px-4 py-3">
                  Delete Account
                </div>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your account and remove your data from our servers. Please
                    log in to GitHub again to continue.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={deleteOwnAccount}>
                    Delete Account
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardDescription>
      </CardContent>
    </Card>
  );
}
