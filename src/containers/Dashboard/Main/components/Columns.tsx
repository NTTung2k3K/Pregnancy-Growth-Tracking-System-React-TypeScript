import { Button } from "@/components/ui/button";
import { Column, ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { BlogMainDashboard } from "./IBlog";



const columnFields: { key: keyof BlogMainDashboard; label: string }[] = [
  { key: "title", label: "Title" },
  { key: "likesCount", label: "Likes" },
  { key: "week", label: "Week" },
];

export const columns: ColumnDef<BlogMainDashboard>[] = [
  ...columnFields.map(({ key, label }) => ({
    accessorKey: key,
    header: ({ column }: { column: Column<BlogMainDashboard> }) => {
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
  //   {
  //     accessorKey: "image",
  //     header: ({ column }) => {
  //       return (
  //         <Button
  //           variant="ghost"
  //           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //         >
  //           Image
  //           <ArrowUpDown className="ml-2 h-4 w-4" />
  //         </Button>
  //       );
  //     },
  //     cell: ({ row }) => {
  //       const isImageUrl = row.getValue("image") || false;
  //       return isImageUrl ? (
  //         <img width={120} src={row.getValue("image")} alt="Image" />
  //       ) : (
  //         <p>No image</p>
  //       );
  //     },
  //   },
  //   {
  //     accessorKey: "status",
  //     header: ({ column }) => {
  //       return (
  //         <Button
  //           variant="ghost"
  //           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //         >
  //           Status
  //           <ArrowUpDown className="ml-2 h-4 w-4" />
  //         </Button>
  //       );
  //     },
  //     cell: ({ row }) => {
  //       const isActive = row.getValue("status") == "Active";
  //       return (
  //         <Badge className={cn("bg-slate-500", isActive && "bg-emerald-400")}>
  //           {isActive ? "Active" : "Inactive"}
  //         </Badge>
  //       );
  //     },
  //   },
];
