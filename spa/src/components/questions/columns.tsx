import { ColumnDef } from "@tanstack/react-table";
import { TypographySmall } from "../ui/typography";
import { Button } from "../ui/button";
import { EditIcon, ArrowUpDown } from "lucide-react";
import { Difficulty, Question } from "../../types/QuestionTypes";
import { useNavigate } from "react-router-dom";

const navigate = useNavigate()

export const columns: ColumnDef<Question>[] = [
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
        <TypographySmall className={`${getDifficultyColor(difficulty)}`}>
          {difficulty}
        </TypographySmall>
      );
    },
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      const difficulty = row.getValue("difficulty") as Difficulty;
      return (
        <TypographySmall className={`${getDifficultyColor(difficulty)}`}>
          {difficulty}
        </TypographySmall>
      );
    },
  },
  {
    accessorKey: "id",
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const questionId = row.index;
      return (
        <div className="flex gap-2 justify-between">
          {
            <Button variant="secondary" size="icon" className="h-8 w-8" onClick={() => {
              navigate(`edit/${questionId}`);
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
            View
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
