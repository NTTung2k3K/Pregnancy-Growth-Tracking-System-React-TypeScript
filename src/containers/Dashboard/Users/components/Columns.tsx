import { Button } from "@/components/ui/button";
import { Column, ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Pencil } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { ROUTES } from "@/routes";

export interface User {
  id: string;
  email: string | null;
  fullName: string | null;
  image: string | null;
  dateOfBirth: string | null;
  address: string | null;
  gender: string | null;
  bloodGroup: string | null;
  status: string;
  dueDate: string | null;
}

const columnFields: { key: keyof User; label: string }[] = [
  { key: "id", label: "ID" },
  { key: "image", label: "Image" },
  { key: "dateOfBirth", label: "DOB" },
  { key: "address", label: "Address" },
  { key: "gender", label: "Gender" },
  { key: "bloodGroup", label: "BloodGroup" },
  { key: "dueDate", label: "DueDate" },
];

export const columns: ColumnDef<User>[] = [
  ...columnFields.map(({ key, label }) => ({
    accessorKey: key,
    header: ({ column }: { column: Column<User> }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {label}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  })),
  {
    id: "actions",
    cell: ({ row }) => {
      const { id } = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-4 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="text-sky-800">
            <Link
              className="text-sky-800"
              to={`${ROUTES.DASHBOARD_USER_UPDATE.replace(":id", id)}`}
            >
              <DropdownMenuItem className="cursor-pointer">
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
            </Link>
            <DropdownMenuItem className="cursor-pointer font-semibold">
              <Pencil className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
