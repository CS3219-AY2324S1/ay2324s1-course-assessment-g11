import { ColumnDef } from "@tanstack/react-table";
import { TypographySmall } from "../ui/typography";
import { Button } from "../ui/button";
import { EditIcon, ArrowUpDown } from "lucide-react";
import { Difficulty, Question } from "../../types/QuestionTypes";
import { useNavigate } from "react-router-dom";

export const columns: ColumnDef<Question>[] = [
  {
    accessorKey: "title",
    header: "Title",
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
      const category = row.getValue("category") as String;
      return (
        <TypographySmall>
          {category}
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
      const navigate = useNavigate()

      return (
        <div className="flex gap-2 justify-between">
          {
            <Button variant="secondary" className="h-8 gap-2" onClick={() => {
              navigate(`edit/${questionId}`);
            }}>
              Edit/Delete
              <EditIcon size={20} />
            </Button>}
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-2"
            onClick={() => {
              navigate(`view/${questionId}`);
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

export const getDifficultyColor = (difficulty: Difficulty) => {
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
