import { Button } from "@/components/ui/button";
import { Column, ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Trash, UserPen } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import { ROUTES } from "@/routes";
import axios from "axios";
import { BASE_URL, configHeaders } from "@/services/config";
import { API_ROUTES } from "@/routes/api";
import toast from "react-hot-toast";
import { Standard } from "./IStandard";

const columnFields: { key: keyof Standard; label: string }[] = [
  { key: "gestationalAge", label: "Week" },
  { key: "averageWeight", label: "Weight" },
  { key: "averageHeight", label: "Height" },
  { key: "fetalHeartRate", label: "Heart Rate" },
];

export const columns: ColumnDef<Standard>[] = [
  ...columnFields.map(({ key, label }) => ({
    accessorKey: key,
    header: ({ column }: { column: Column<Standard> }) => {
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
      const { week } = row.original;
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
              to={`${ROUTES.DASHBOARD_GROWTH_STANDARDS_UPDATE.replace(":id", String(week))}`}
            >
              <DropdownMenuItem className="cursor-pointer">
                <UserPen className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
            </Link>

            <DropdownMenuItem className="cursor-pointer font-semibold">
              <div
                onClick={() => handleDelete(week)}
                className="w-full flex items-center"
              >
                <Trash className="h-4 w-4 mr-2" />
                <p>Delete</p>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

const handleDelete = async (id: number) => {
  const confirm = window.confirm(" Do you really want to delete?");
  if (!confirm) return;

  try {
    await axios.delete(
      `${BASE_URL + API_ROUTES.DASHBOARD_GROWTH_STANDARD_DELETE}/${id}`,
      {
        headers: configHeaders(),
      }
    );
    window.location.href = `${ROUTES.DASHBOARD_GROWTH_STANDARDS}`;
    toast.success("Deleted successfully");
  } catch (error) {
    console.error("Failed to delete template:", error);
    toast.error("Please login again to refresh token");
  }
};
