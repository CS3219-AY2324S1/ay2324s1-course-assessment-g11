import { Attempt } from "@/types/UserTypes";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../ui/button";

export const columns: ColumnDef<Attempt>[] = [
  {
    accessorKey: "room_id",
    header: "Attempt Type",
    cell: ({ row }) => {
      const roomId = row.getValue("room_id") as string;
      return roomId ? "Interview" : "Solo";
    },
  },
  {
    accessorKey: "solved",
    header: "Status",
    cell: ({ row }) => {
      const solved = row.getValue("solved") as boolean;
      return solved ? <div className="text-green-500">Solved</div> : "Unsolved";
    },
  },
  {
    accessorKey: "time_created",
    header: "Attempted At",
    cell: ({ row }) => {
      const timeCreated = row.getValue("time_created") as Date;
      return timeCreated.toLocaleString();
    },
    enableSorting: true,
    sortDescFirst: true,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const attemptId = row.original.id;
      return (
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-2"
          onClick={() => {
            window.location.href = `/attempt/${attemptId}`;
          }}
        >
          View More
        </Button>
      );
    },
  },
];
