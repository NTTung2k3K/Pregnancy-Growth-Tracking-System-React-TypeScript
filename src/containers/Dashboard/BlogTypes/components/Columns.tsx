import { Button } from "@/components/ui/button";
import { Column, ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Pencil, Trash } from "lucide-react";

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
import toast from "react-hot-toast";

export interface BlogType {
  id:  number;
  name: string;
  thumbnail: string | null;
}



const columnFields: { key: keyof BlogType; label: string }[] = [
  { key: "id", label: "ID" },
  { key: "name", label: "Name" },
];

export const columns: ColumnDef<BlogType>[] = [
  ...columnFields.map(({ key, label }) => ({
    accessorKey: key,
    header: ({ column }: { column: Column<BlogType> }) => {
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
     accessorKey: "thumbnail",
     header: ({ column }) => {
       return (
         <Button
           variant="ghost"
           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
         >
           Thumbnail
           <ArrowUpDown className="ml-2 h-4 w-4" />
         </Button>
       );
     },
     cell: ({ row }) => {
       const thumbnailUrl = row.getValue("thumbnail") || false;
       return thumbnailUrl ? (
         <img width={120} src={row.getValue("thumbnail")} alt="Thumbnail" />
       ) : (
         <p>No thumbnail</p>
       );
     },
   },

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
              to={`${ROUTES.DASHBOARD_BLOGTYPE_UPDATE.replace(":id", id.toString())}`}
            >
              <DropdownMenuItem className="cursor-pointer">
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
            </Link>
            <Link
              className="text-sky-800"
              to={`${ROUTES.DASHBOARD_BLOGTYPE_DETAIL.replace(":id", id.toString())}`}
            >
              <DropdownMenuItem className="cursor-pointer">
                Detail
              </DropdownMenuItem>
            </Link>
            <DropdownMenuItem className="cursor-pointer font-semibold">
              <div
                onClick={() => handleDelete(id.toString())}
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

const handleDelete = async (id: string) => {
  const confirmLeave = window.confirm("Do you really want to delete?");
  if (!confirmLeave) return;

  try {
    await axios.delete(`${BASE_URL}/blogtype/delete/${id}`, {
      headers: configHeaders(),
    });
    
    window.location.href = `/dashboard/blogtypes`;
    toast.success("Deleted successfully");
  } catch (error) {
    console.error("Failed to delete blogtype:", error);
    toast.error("Please login again to refresh token");
  }
};
