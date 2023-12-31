import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import { ColumnDef } from "@tanstack/react-table";

export type PublicUser = {
  uid: string;
  displayName: string;
  attempts: number;
  photoUrl: string;
};

const getInitials = (name: string) => {
  const names = name.split(" ");
  let initials = "";
  names.forEach((n) => {
    initials += n[0]?.toUpperCase() || "";
  });
  return initials;
};

export const columns: ColumnDef<PublicUser>[] = [
  {
    accessorKey: "displayName",
    header: "User",
    cell: ({ row }) => {
      const displayName = row.getValue("displayName") as string;
      const photoURL = row.original.photoUrl;
      const uid = row.original.uid;

      return (
        <Button
          variant="ghost"
          onClick={() => {
            window.location.href = `/profile/${uid}`;
          }}
          className="w-64"
        >
          <div className="flex items-center justify-start gap-2 w-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src={photoURL ?? ""} />
              <AvatarFallback>{getInitials(displayName ?? "")}</AvatarFallback>
            </Avatar>
            {displayName}
          </div>
        </Button>
      );
    },
  },
  {
    accessorKey: "attempts",
    header: "Attempts",
    invertSorting: true,
  },
];
