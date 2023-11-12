import { ColumnDef } from "@tanstack/react-table";
import { TypographySmall } from "../ui/typography";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { EditIcon, PlayIcon, ArrowUpDown } from "lucide-react";
import { Difficulty, Question } from "../../types/QuestionTypes";

export const getColumnDefs: (isEditable: boolean) => ColumnDef<Question>[] = isEditable => [
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size="sm"
          className="pl-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    enableHiding: false,
  },
  {
    accessorKey: "difficulty",
    header: "Difficulty",
    cell: ({ row }) => {
      const difficulty = row.getValue("difficulty") as Difficulty;
      return (
        <Badge variant="secondary" className="h-min">
          <TypographySmall className={`${getDifficultyColor(difficulty)}`}>
            {difficulty}
          </TypographySmall>
        </Badge>
      );
    },
  },
  {
    accessorKey: "id",
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const questionId = row.original.id;
      return (
        <div className="flex gap-2 justify-between">
          {isEditable &&
            <Button variant="secondary" size="icon" className="h-8 w-8" onClick={() => {
              window.location.href = `${questionId}/edit`;
            }}>
              <EditIcon size={20} />
            </Button>}
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-2"
            onClick={() => {
              window.location.href = `${questionId}`;
            }}
          >
            Practice
            <PlayIcon size={20} />
          </Button>
        </div>
      );
    },
    enableHiding: false,
  },
];

const getDifficultyColor = (difficulty: Difficulty) => {
  switch (difficulty) {
    case "easy":
      return "text-green-500";
    case "medium":
      return "text-orange-500";
    case "hard":
      return "text-red-500";
    default:
      return "text-gray-500";
  }
};
